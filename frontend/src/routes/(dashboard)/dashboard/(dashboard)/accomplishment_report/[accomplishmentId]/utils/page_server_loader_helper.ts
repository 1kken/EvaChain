import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createAccomplishmentProgramProjectSchema,
	updateAccomplishmentProgramProjectSchema
} from '../schema/program_project_schema';
import { universalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import {
	createAccomplishmentMetricSchema,
	updateAccomplishmentMetricSchema
} from '../schema/metrics_schema';

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

export async function getProgramProjects(
	supabase: SupabaseClient<Database>,
	accomplishmentId: string
) {
	const { data, error } = await supabase
		.from('accomplishment_program_project')
		.select('*')
		.eq('accomplishment_report_id', accomplishmentId)
		.order('position', { ascending: true });

	if (error) {
		throw error;
	}

	return data;
}

//forms
export async function getAccomplishmentProgramProjectForms() {
	return {
		createForm: await superValidate(zod(createAccomplishmentProgramProjectSchema)),
		updateForm: await superValidate(zod(updateAccomplishmentProgramProjectSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getAccomplismentMetricsForms() {
	return {
		createForm: await superValidate(zod(createAccomplishmentMetricSchema)),
		updateForm: await superValidate(zod(updateAccomplishmentMetricSchema)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}
