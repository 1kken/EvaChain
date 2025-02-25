import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createIpcrFunctionSchema, updateIpcrFunctionSchema } from '../schema/ipcr_function_schema';
import { universalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';
import { error } from '@sveltejs/kit';
import {
	createIpcrFunctionCategorySchema,
	updateIpcrFunctionCategorySchema
} from '../schema/ipcr_category_schema';
import {
	createIpcrIndicatorSchema,
	updateIpcrIndicatorSchema
} from '../schema/ipcr_indicator_schema';
import {
	createIpcrFunctionSubCategorySchema,
	updateIpcrFunctionSubCategorySchema
} from '../schema/ipcr_sub_category_schema';
import { submitIPCRschema } from '../schema/ipcr_submit_schema';
import {
	createAccomplishmentSchema,
	updateAccomplishmentSchema
} from '../schema/ipcr_indicator_accomplishmet';

//fetch functions
export async function getCurrentIPCRFunction(ipcrId: string, supabase: SupabaseClient<Database>) {
	const { data: ipcrFunction, error: ipcrFunctionError } = await supabase
		.from('ipcr_function')
		.select()
		.eq('ipcr_id', ipcrId);
	if (ipcrFunctionError) {
		error(500, ipcrFunctionError.message);
	}
	return ipcrFunction;
}

//fetch current IPCR
export async function getCurrentIPCR(ipcrId: string, supabase: SupabaseClient<Database>) {
	const { data: ipcr, error: ipcrError } = await supabase
		.from('ipcr')
		.select()
		.eq('id', ipcrId)
		.single();
	if (ipcrError) {
		error(500, ipcrError.message);
	}
	return ipcr;
}

//fetch ipcr suopervisor details
export async function getSupervisors(supabase: SupabaseClient<Database>, ipcrId: string) {
	const { data: supervisors, error: supervisorsError } = await supabase
		.from('ipcr_supervisor_details_view')
		.select()
		.eq('ipcr_id', ipcrId);
	if (supervisorsError) {
		error(500, supervisorsError.message);
	}
	return supervisors;
}

//forms
export async function getIPCRFunctionForms() {
	return {
		createForm: await superValidate(zod(createIpcrFunctionSchema)),
		updateForm: await superValidate(zod(updateIpcrFunctionSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getIPCRFunctionCategoryForms() {
	return {
		createForm: await superValidate(zod(createIpcrFunctionCategorySchema)),
		updateForm: await superValidate(zod(updateIpcrFunctionCategorySchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getIPCRFunctionSubCategoryForms() {
	return {
		createForm: await superValidate(zod(createIpcrFunctionSubCategorySchema)),
		updateForm: await superValidate(zod(updateIpcrFunctionSubCategorySchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getIPCRIndicatorForms() {
	return {
		createForm: await superValidate(zod(createIpcrIndicatorSchema)),
		updateForm: await superValidate(zod(updateIpcrIndicatorSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getIPCRIndicatorAccomplishmentForms() {
	return {
		createForm: await superValidate(zod(createAccomplishmentSchema)),
		updateForm: await superValidate(zod(updateAccomplishmentSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getIPCRSubmitForm() {
	return {
		submitForm: await superValidate(zod(submitIPCRschema))
	};
}
