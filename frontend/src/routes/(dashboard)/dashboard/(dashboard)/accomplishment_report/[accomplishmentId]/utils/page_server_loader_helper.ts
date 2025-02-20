import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createAccomplishmentHeaderSchema,
	updateAccomplishmentHeaderSchema
} from '../schema/header_schema';
import { universalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import {
	createAccomplishmentAnnualPlanSchema,
	updateAccomplishmentAnnualPlanSchema
} from '../schema/annual_plan_schema';
import {
	createAccomplishmentActivitySchema,
	updateAccomplishmentActivitySchema
} from '../schema/activity_schema';
import {
	createAccomplishmentActivityIndicatorSchema,
	updateAccomplishmentActivityIndicatorSchema
} from '../schema/indicator_schema';

//load data
export async function getCurrentAccomplishmentReport(
	supabase: SupabaseClient<Database>,
	accomplishmentId: string
) {
	const { data, error } = await supabase
		.from('accomplishment_report')
		.select('*')
		.eq('id', accomplishmentId)
		.single();

	if (error) {
		throw error;
	}

	return data;
}

export async function getAccomplishmentHeaders(
	supabase: SupabaseClient<Database>,
	accomplishmentId: string
) {
	const { data, error } = await supabase
		.from('accomplishment_header')
		.select('*')
		.eq('accomplishment_report_id', accomplishmentId);

	if (error) {
		throw error;
	}

	return data;
}

//forms
export async function getAccomplishmentHeaderForms() {
	return {
		createForm: await superValidate(zod(createAccomplishmentHeaderSchema)),
		updateForm: await superValidate(zod(updateAccomplishmentHeaderSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getAccomplishmentAnnualPlanForms() {
	return {
		createForm: await superValidate(zod(createAccomplishmentAnnualPlanSchema)),
		updateForm: await superValidate(zod(updateAccomplishmentAnnualPlanSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getAccomplishmentActivityForms() {
	return {
		createForm: await superValidate(zod(createAccomplishmentActivitySchema)),
		updateForm: await superValidate(zod(updateAccomplishmentActivitySchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getAccomplishmentIndicatorForms() {
	return {
		createForm: await superValidate(zod(createAccomplishmentActivityIndicatorSchema)),
		updateForm: await superValidate(zod(updateAccomplishmentActivityIndicatorSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}
