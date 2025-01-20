import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createOpAnnualPlanSchema,
	updateOpAnnualPlanSchema,
	type CreateOpAnnualPlanSchema,
	type UpdateOpAnnualPlanSchema
} from '../schema/op_annual_plan_schema';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';
import { zod } from 'sveltekit-superforms/adapters';
import { titleCase } from 'title-case';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';

export async function createOpAnnualPlan(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<CreateOpAnnualPlanSchema>, App.Superforms.Message>(
		request,
		zod(createOpAnnualPlanSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	let { position, op_header_id, description } = form.data;
	const { data: opAnnualPlan, error: opAnnualPlanError } = await supabase
		.from('op_annual_plan')
		.insert({ position, op_header_id, description: titleCase(description) })
		.select()
		.single();
	if (opAnnualPlanError) {
		return message(form, {
			status: 'error',
			text: `Error saving annual plan, ${opAnnualPlanError.message}`
		});
	}

	return { form, opAnnualPlan };
}

export async function deleteOpAnnualPlan(request: Request, supabase: SupabaseClient<Database>) {
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

	const { data: opAnnualPlan, error: opAnnualPlanError } = await supabase
		.from('op_annual_plan')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (opAnnualPlanError) {
		return message(form, {
			status: 'error',
			text: `Error deleting annual plan, ${opAnnualPlanError.message}`
		});
	}

	return { form, opAnnualPlan };
}

export async function updateOpAnnualPlan(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateOpAnnualPlanSchema>, App.Superforms.Message>(
		request,
		zod(updateOpAnnualPlanSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	let { id, description } = form.data;

	const { data: opAnnualPlan, error: opAnnualPlanError } = await supabase
		.from('op_annual_plan')
		.update({ description })
		.eq('id', id)
		.select()
		.single();

	if (opAnnualPlanError) {
		return message(form, {
			status: 'error',
			text: `Error updating annual plan, ${opAnnualPlanError.message}`
		});
	}

	return { form, opAnnualPlan };
}
