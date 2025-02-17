import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createOpHeaderSchema, updateOpHeaderSchema } from '../schema/op_header_schema';
import { universalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import { createOpActivitySchema, updateOpActivitySchema } from '../schema/op_activity_schema';
import {
	createOpAnnualPlanSchema,
	updateOpAnnualPlanSchema
} from '../schema/op_annual_plan_schema';
import {
	createOpActivityIndicatorSchema,
	updateOpActivityIndicatorSchema
} from '../schema/op_indicator_schema';
import { submitOPschema } from '../schema/op_submit_schema';

export async function getOperationalPlan(opid: string, supabase: SupabaseClient<Database>) {
	const { data: operational_plan, error: fetchOpError } = await supabase
		.from('operational_plan')
		.select('*')
		.eq('id', opid)
		.single();

	if (fetchOpError) {
		return error(500, `Failed to fetch operational plan ${fetchOpError.hint}`);
	}

	return operational_plan;
}

//fetch current op headers
export async function getOpHeaders(opid: string, supabase: SupabaseClient<Database>) {
	const { data: op_headers, error: fetchOpHeaderError } = await supabase
		.from('op_header')
		.select('*')
		.eq('operational_plan_id', opid);

	if (fetchOpHeaderError) {
		return error(500, `Failed to fetch operational plan headers ${fetchOpHeaderError.hint}`);
	}

	return op_headers;
}

export async function getOpHeaderForms() {
	return {
		createForm: await superValidate(zod(createOpHeaderSchema)),
		updateForm: await superValidate(zod(updateOpHeaderSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getOpAnnualPlanForms() {
	return {
		createForm: await superValidate(zod(createOpAnnualPlanSchema)),
		updateForm: await superValidate(zod(updateOpAnnualPlanSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getOpActivityForms() {
	return {
		createForm: await superValidate(zod(createOpActivitySchema)),
		updateForm: await superValidate(zod(updateOpActivitySchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getOpIndicatorForms() {
	return {
		createForm: await superValidate(zod(createOpActivityIndicatorSchema)),
		updateForm: await superValidate(zod(updateOpActivityIndicatorSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getOpSubmitForm() {
	return await superValidate(zod(submitOPschema));
}
