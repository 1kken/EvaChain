import { message, superValidate, type Infer } from 'sveltekit-superforms';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';
import { zod } from 'sveltekit-superforms/adapters';
import { titleCase } from 'title-case';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';
import {
	createAccomplishmentAnnualPlanSchema,
	updateAccomplishmentAnnualPlanSchema,
	type CreateAccomplishmentAnnualPlanSchema,
	type UpdateAccomplishmentAnnualPlanSchema
} from '../schema/annual_plan_schema';

export async function createAccomplishmentAnnualPlan(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<
		Infer<CreateAccomplishmentAnnualPlanSchema>,
		App.Superforms.Message
	>(request, zod(createAccomplishmentAnnualPlanSchema));
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	let { position, accomplishment_header_id, description } = form.data;
	const { data: accAnnualPlan, error: accAnnualPlanError } = await supabase
		.from('accomplishment_annual_plan')
		.insert({ position, accomplishment_header_id, description: description })
		.select()
		.single();

	if (accAnnualPlanError) {
		return message(form, {
			status: 'error',
			text: `Error saving annual plan, ${accAnnualPlanError.message}`
		});
	}

	return { form, accAnnualPlan };
}

export async function deleteAccomplishmentAnnualPlan(
	request: Request,
	supabase: SupabaseClient<Database>
) {
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
	let { id } = form.data;

	const { data: accAnnualPlan, error: accAnnualPlanError } = await supabase
		.from('accomplishment_annual_plan')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (accAnnualPlanError) {
		return message(form, {
			status: 'error',
			text: `Error deleting annual plan, ${accAnnualPlanError.message}`
		});
	}

	return { form, accAnnualPlan };
}

export async function updateAccomplishmentAnnualPlan(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<
		Infer<UpdateAccomplishmentAnnualPlanSchema>,
		App.Superforms.Message
	>(request, zod(updateAccomplishmentAnnualPlanSchema));

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	let { id, description } = form.data;

	const { data: accAnnualPlan, error: accAnnualPlanError } = await supabase
		.from('accomplishment_annual_plan')
		.update({ description })
		.eq('id', id)
		.select()
		.single();

	if (accAnnualPlanError) {
		return message(form, {
			status: 'error',
			text: `Error updating annual plan, ${accAnnualPlanError.message}`
		});
	}

	return { form, accAnnualPlan };
}
