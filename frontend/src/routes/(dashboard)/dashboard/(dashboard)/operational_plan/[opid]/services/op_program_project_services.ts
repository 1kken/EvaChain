import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createOpProgramProjectSchema,
	updateOpProgramProjectSchema,
	type CreateOpProgramProjectSchema,
	type UpdateOpProgramProjectSchema
} from '../schema/op_project_program_schema';
import { zod } from 'sveltekit-superforms/adapters';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';

export async function createOpProgramProject(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<CreateOpProgramProjectSchema>, App.Superforms.Message>(
		request,
		zod(createOpProgramProjectSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	let { position, op_header_id, description } = form.data;

	const { data: opProgramProject, error: opProgramProjectError } = await supabase
		.from('op_program_project')
		.insert({ position, op_header_id, description })
		.select()
		.single();
	if (opProgramProjectError) {
		return message(form, {
			status: 'error',
			text: `Error saving  program/project , ${opProgramProjectError.message}`
		});
	}

	return { form, opProgramProject };
}

//update
export async function updateOpProgramProject(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateOpProgramProjectSchema>, App.Superforms.Message>(
		request,
		zod(updateOpProgramProjectSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	let { id, description } = form.data;

	const { data: opProgramProject, error: opProgramProjectError } = await supabase
		.from('op_program_project')
		.update({ description })
		.eq('id', id)
		.select()
		.single();

	if (opProgramProjectError) {
		return message(form, {
			status: 'error',
			text: `Error updating program/project, ${opProgramProjectError.message}`
		});
	}

	return { form, opProgramProject };
}

//delete
export async function deleteOpProgramProject(request: Request, supabase: SupabaseClient<Database>) {
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

	const { data: opProgramProject, error: opProgramProjectError } = await supabase
		.from('op_program_project')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (opProgramProjectError) {
		return message(form, {
			status: 'error',
			text: `Error deleting program/project, ${opProgramProjectError.message}`
		});
	}

	return { form, opProgramProject };
}
