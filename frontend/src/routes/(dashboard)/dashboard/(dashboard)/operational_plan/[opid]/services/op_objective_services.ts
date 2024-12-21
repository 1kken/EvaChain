import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createOpObjectiveSchema,
	updateOpObjectiveSchema,
	type CreateOpObjectiveSchema,
	type UpdateOpObjectiveSchema
} from '../schema/op_objective_schema';
import { zod } from 'sveltekit-superforms/adapters';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';

export async function createOpObjectives(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<CreateOpObjectiveSchema>, App.Superforms.Message>(
		request,
		zod(createOpObjectiveSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { data: opObjective, error: opObjectiveError } = await supabase
		.from('op_objective')
		.insert({ ...form.data })
		.select()
		.single();
	if (opObjectiveError) {
		return message(form, {
			status: 'error',
			text: `Error saving objective , ${opObjectiveError.message}`
		});
	}

	return { form, opObjective };
}

//delete
export async function deleteOpObjectives(request: Request, supabase: SupabaseClient<Database>) {
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

	const { data: opObjective, error: opObjectiveError } = await supabase
		.from('op_objective')
		.delete()
		.eq('id', form.data.id)
		.select()
		.single();

	if (opObjectiveError) {
		return message(form, {
			status: 'error',
			text: `Error saving objective function, ${opObjectiveError.message}`
		});
	}

	return { form, opObjective };
}

//update
export async function updateOpObjectives(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateOpObjectiveSchema>, App.Superforms.Message>(
		request,
		zod(updateOpObjectiveSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { data: opObjective, error: opObjectiveError } = await supabase
		.from('op_objective')
		.update({ ...form.data })
		.eq('id', form.data.id)
		.select()
		.single();

	if (opObjectiveError) {
		return message(form, {
			status: 'error',
			text: `Error saving objective function, ${opObjectiveError.message}`
		});
	}

	return { form, opObjective };
}
