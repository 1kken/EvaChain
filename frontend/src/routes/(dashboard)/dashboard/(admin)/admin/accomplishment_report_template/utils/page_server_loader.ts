import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createAccomplishmentProgramProjectSchemaTemplate,
	updateAccomplishmentProgramProjectSchemaTemplate
} from '../schema/program_project_schema';
import { universalDeleteSchema } from '$lib/schemas/universal_delete_schema';
import {
	createAccomplishmentMetricSchemaTemplate,
	updateAccomplishmentMetricSchemaTemplate
} from '../schema/metrics_schema';

export async function getTemplateProgramProjects(supabase: SupabaseClient<Database>) {
	const { data, error } = await supabase.from('accomplishment_template_program_project').select();

	if (error) {
		throw error;
	}

	return data;
}

export async function getTemplateAccReport(supabase: SupabaseClient<Database>) {
	const { data, error } = await supabase
		.from('accomplishment_report_template')
		.select()
		.limit(1)
		.single();

	if (error) {
		throw error;
	}

	return data;
}

//FORMS
export async function getAccomplishmentProgramProjectTemplateForms() {
	return {
		createForm: await superValidate(zod(createAccomplishmentProgramProjectSchemaTemplate)),
		updateForm: await superValidate(zod(updateAccomplishmentProgramProjectSchemaTemplate)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}

export async function getAccomplishmentMetricsTemplateForms() {
	return {
		createForm: await superValidate(zod(createAccomplishmentMetricSchemaTemplate)),
		updateForm: await superValidate(zod(updateAccomplishmentMetricSchemaTemplate)),
		deleteForm: await superValidate(zod(universalDeleteSchema))
	};
}
