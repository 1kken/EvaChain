import type { Database, Tables } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { universalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import { createOpcrFunctionSchema, updateOpcrFunctionSchema } from '../schema/function_schema';
import { createOpcrCategorySchema, updateOpcrCategorySchema } from '../schema/category_schema';
import { createOpcrIndicatorSchema, updateOpcrIndicatorSchema } from '../schema/indicator_schema';

export async function fetchOPCR(opcrid: string, supabase: SupabaseClient<Database>) {
	const { data, error: fetchError } = await supabase
		.from('opcr')
		.select('*')
		.eq('id', opcrid)
		.single();

	if (fetchError) {
		error(500, { message: 'Failed to fetch OPCR data' });
	}

	return data;
}

export async function fetchOPCRFunctions(opcrid: string, supabase: SupabaseClient<Database>) {
	const { data, error: fetchError } = await supabase
		.from('opcr_function')
		.select('*')
		.eq('opcr_id', opcrid);

	if (fetchError) {
		error(500, { message: 'Failed to fetch OPCR functions' });
	}

	return data;
}

//forms
export async function fetchOpcrFunctionForms() {
	return {
		createForm: await superValidate(zod(createOpcrFunctionSchema)),
		updateForm: await superValidate(zod(updateOpcrFunctionSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function fetchOpcrFunctionCategoryForms() {
	return {
		createForm: await superValidate(zod(createOpcrCategorySchema)),
		updateForm: await superValidate(zod(updateOpcrCategorySchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function fetchOpcrFunctionIndicatorForms() {
	return {
		createForm: await superValidate(zod(createOpcrIndicatorSchema)),
		updateForm: await superValidate(zod(updateOpcrIndicatorSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}
