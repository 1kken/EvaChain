import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createAccomplishmentProgramProjectSchemaTemplate,
	updateAccomplishmentProgramProjectSchemaTemplate,
	type CreateAccomplishmentProgramProjectSchemaTemplate,
	type UpdateAccomplishmentProgramProjectSchemaTemplate
} from '../schema/program_project_schema';
import { zod } from 'sveltekit-superforms/adapters';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';

export async function createTemplateProgramProject(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<
		Infer<CreateAccomplishmentProgramProjectSchemaTemplate>,
		App.Superforms.Message
	>(request, zod(createAccomplishmentProgramProjectSchemaTemplate));

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	let { position, accomplishment_report_template_id, program_project } = form.data;

	const { data: programProject, error: programProjectError } = await supabase
		.from('accomplishment_template_program_project')
		.insert({
			position,
			accomplishment_report_template_id,
			program_project
		})
		.select()
		.single();

	if (programProjectError) {
		return message(form, {
			status: 'error',
			text: `Error saving program/project template, ${programProjectError.message}`
		});
	}

	return { form, programProject };
}

export async function updateTemplateProgramProject(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<
		Infer<UpdateAccomplishmentProgramProjectSchemaTemplate>,
		App.Superforms.Message
	>(request, zod(updateAccomplishmentProgramProjectSchemaTemplate));

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	let { id, program_project } = form.data;

	const { data: programProject, error: programProjectError } = await supabase
		.from('accomplishment_template_program_project')
		.update({ program_project })
		.eq('id', id)
		.select()
		.single();

	if (programProjectError) {
		return message(form, {
			status: 'error',
			text: `Error updating program/project template, ${programProjectError.message}`
		});
	}

	return { form, programProject };
}

export async function deleteTemplateProgramProject(
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

	const { data: programProject, error: programProjectError } = await supabase
		.from('accomplishment_template_program_project')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (programProjectError) {
		return message(form, {
			status: 'error',
			text: `Error deleting program/project template, ${programProjectError.message}`
		});
	}

	return { form, programProject };
}
