import type { Database, Tables } from '$lib/types/database.types';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createStrategicPlanSchema,
	updateStrategicPlanSchema,
	type CreateStratPlanSchema,
	type UpdateStratPlanSchema
} from './strat_plan_schema';
import { zod } from 'sveltekit-superforms/adapters';
import { fetchProfile } from '$lib/utils/profileHelper';
import { error } from '@sveltejs/kit';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function createStrategicPlan(
	request: Request,
	supabase: SupabaseClient<Database>,
	ownerId: string
) {
	const form = await superValidate<Infer<CreateStratPlanSchema>, App.Superforms.Message>(
		request,
		zod(createStrategicPlanSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	const { profile, profileError } = await fetchProfile(ownerId, supabase);

	if (profileError || !profile) {
		error(500, { message: 'Failed to fetch profile' });
	}

	const { unit_id, program_id, office_id } = profile;
	const { goal, major_output, title, objectives, start_year, end_year } = form.data;
	const data = {
		unit_id,
		program_id,
		office_id,
		owner_id: ownerId,
		goal,
		major_output,
		title,
		start_year,
		end_year
	};

	const { data: stratPlan, error: insertError } = await supabase
		.from('strategic_plan')
		.insert({ ...data })
		.select()
		.single();

	if (insertError) {
		error(500, { message: 'Failed to insert Strategic Plan' });
	}
	insertObjectives(stratPlan.id, objectives, supabase);
	return { form, stratPlan };
}

interface Objectives {
	objective: string;
	position: number;
}

async function insertObjectives(
	stratPlanId: string,
	objectives: Objectives[],
	supabase: SupabaseClient<Database>
) {
	const objectiveWithStrategyId = objectives.map((objective) => ({
		...objective,
		strategic_plan_id: stratPlanId
	}));

	const { error: insertError } = await supabase
		.from('strat_plan_objective')
		.insert(objectiveWithStrategyId);

	if (insertError) {
		error(500, { message: 'Failed to insert objectives' });
	}
}

export async function deleteStrategicPlan(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UniversalDeleteSchema>, App.Superforms.Message>(
		request,
		zod(universalDeleteSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id } = form.data;

	const { data: stratPlan, error } = await supabase
		.from('strategic_plan')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (error) {
		return message(form, {
			status: 'error',
			text: `Error deleting Strategic plan: ${error.message}`
		});
	}

	return { form, stratPlan };
}

// Assuming you have a schema defined similarly to DPCR
export async function updateStrategicPlan(request: Request, supabase: SupabaseClient<Database>) {
	// Validate form data
	const form = await superValidate<Infer<UpdateStratPlanSchema>, App.Superforms.Message>(
		request,
		zod(updateStrategicPlanSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Invalid form data'
		});
	}

	try {
		const { id, title, objectives, ...planData } = form.data;

		// Update strategic plan
		const { data: stratPlan, error: updateError } = await supabase
			.from('strategic_plan')
			.update({ title, ...planData })
			.eq('id', id)
			.select()
			.single();

		if (updateError) throw updateError;

		if (objectives) {
			// Handle objectives updates in parallel
			await Promise.all([
				handleObjectiveDeletions(id, objectives, supabase),
				upsertObjectives(objectives, supabase)
			]);
		}
		return { form, stratPlan };
	} catch (error) {
		return message(form, {
			status: 'error',
			text: `Failed to update strategic plan: ${error instanceof Error ? error.message : 'Unknown error'}`
		});
	}
}

async function handleObjectiveDeletions(
	planId: string,
	newObjectives: Partial<Tables<'strat_plan_objective'>>[],
	supabase: SupabaseClient<Database>
): Promise<void> {
	// Fetch existing objectives
	const { data: existingObjectives, error: fetchError } = await supabase
		.from('strat_plan_objective')
		.select()
		.eq('strategic_plan_id', planId);

	if (fetchError) {
		throw new Error(`Failed to fetch objectives: ${fetchError.message}`);
	}

	if (!existingObjectives) {
		return;
	}

	// Find objectives that need to be deleted
	const objectivesToDelete = existingObjectives.filter(
		(existing) => !newObjectives.some((newObj) => newObj.id === existing.id)
	);

	if (objectivesToDelete.length === 0) {
		return;
	}

	const { error: deleteError } = await supabase
		.from('strat_plan_objective')
		.delete()
		.in(
			'id',
			objectivesToDelete.map((obj) => obj.id)
		);

	if (deleteError) {
		throw new Error(`Failed to delete objectives: ${deleteError.message}`);
	}
}

async function upsertObjectives(
	objectives: Tables<'strat_plan_objective'>[],
	supabase: SupabaseClient<Database>
): Promise<void> {
	const { error: upsertError } = await supabase.from('strat_plan_objective').upsert(objectives);

	if (upsertError) {
		throw new Error(`Failed to upsert objectives: ${upsertError.message}`);
	}
}
