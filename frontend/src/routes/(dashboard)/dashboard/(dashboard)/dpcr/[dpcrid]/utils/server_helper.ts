import type { Database, Tables } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createDpcrFunctionSchema, updateDpcrFunctionSchema } from '../schema/function_schema';
import { universalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import { createDpcrCategorySchema, updateDpcrCategorySchema } from '../schema/category_schema';
import { createDpcrIndicatorSchema, updateDpcrIndicatorSchema } from '../schema/indicator_schema';

export async function fetchDPCR(dpcrid: string, supabase: SupabaseClient<Database>) {
	const { data, error: fetchError } = await supabase
		.from('dpcr')
		.select('*')
		.eq('id', dpcrid)
		.single();

	if (fetchError) {
		error(500, { message: 'Failed to fetch DPCR data' });
	}

	return data;
}

export async function fetchDPCRFunctions(dpcrid: string, supabase: SupabaseClient<Database>) {
	const { data, error: fetchError } = await supabase
		.from('dpcr_function')
		.select('*')
		.eq('dpcr_id', dpcrid);

	if (fetchError) {
		error(500, { message: 'Failed to fetch DPCR functions' });
	}

	return data;
}

//forms
export async function fetchDpcrFunctionForms() {
	return {
		createForm: await superValidate(zod(createDpcrFunctionSchema)),
		updateForm: await superValidate(zod(updateDpcrFunctionSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function fetchDpcrFunctionCategoryForms() {
	return {
		createForm: await superValidate(zod(createDpcrCategorySchema)),
		updateForm: await superValidate(zod(updateDpcrCategorySchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function fetchDpcrFunctionIndicatorForms() {
	return {
		createForm: await superValidate(zod(createDpcrIndicatorSchema)),
		updateForm: await superValidate(zod(updateDpcrIndicatorSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}
