import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createOpHeaderSchema, updateOpHeaderSchema } from '../schema/op_header_schema';
import { universalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import {
	createOpProgramProjectSchema,
	updateOpProgramProjectSchema
} from '../schema/op_project_program_schema';
import { createOpObjectiveSchema, updateOpObjectiveSchema } from '../schema/op_objective_schema';

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

export async function getOpProgramProjectForms() {
	return {
		createForm: await superValidate(zod(createOpProgramProjectSchema)),
		updateForm: await superValidate(zod(updateOpProgramProjectSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getOpObjectiveForms() {
	return {
		createForm: await superValidate(zod(createOpObjectiveSchema)),
		updateForm: await superValidate(zod(updateOpObjectiveSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}
