import {
	createSubCoreFunctionSchema,
	deleteSubCoreFunctionSchema,
	updateSubCoreFunctionSchema,
	type CreateSubCoreFunctionSchema,
	type DeleteSubCoreFunctionSchema,
	type UpdateSubCoreFunctionSchema
} from '../schemas/sub_core_function_schema';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { titleCase } from 'title-case';
import type { SupabaseClient } from '@supabase/supabase-js';
import { zod } from 'sveltekit-superforms/adapters';

export async function createSubCoreFunction(request: Request, supabase: SupabaseClient) {
	const form = await superValidate<Infer<CreateSubCoreFunctionSchema>, App.Superforms.Message>(
		request,
		zod(createSubCoreFunctionSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	let { name, position, core_function_id } = form.data;
	name = titleCase(name.toLocaleLowerCase());

	const { data: subCoreFunction, error: errorSubCoreFunction } = await supabase
		.from('sub_core_function')
		.insert({ name, position, core_function_id })
		.select()
		.single();

	if (errorSubCoreFunction) {
		if (errorSubCoreFunction.code === '23505') {
			return message(form, {
				status: 'error',
				text: `Cannot have the same name for sub core functions!`
			});
		}
		return message(form, {
			status: 'error',
			text: `Error saving core function, ${errorSubCoreFunction.message}`
		});
	}

	return { form, subCoreFunction };
}

export async function deleteSubCoreFunction(request: Request, supabase: SupabaseClient) {
	const form = await superValidate<Infer<DeleteSubCoreFunctionSchema>, App.Superforms.Message>(
		request,
		zod(deleteSubCoreFunctionSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id } = form.data;

	const { error: deleteError, data: subCoreFunction } = await supabase
		.from('sub_core_function')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (deleteError) {
		return message(form, {
			status: 'error',
			text: `Error saving IPCR ${deleteError.message}`
		});
	}

	return { form, subCoreFunction };
}

export async function updateSubCoreFunction(request: Request, supabase: SupabaseClient) {
	const form = await superValidate<Infer<UpdateSubCoreFunctionSchema>, App.Superforms.Message>(
		request,
		zod(updateSubCoreFunctionSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	let { id, name } = form.data;
	if (name) {
		name = titleCase(name.toLocaleLowerCase());
	}

	const { data: subCoreFunction, error: updateError } = await supabase
		.from('sub_core_function')
		.update({ name })
		.eq('id', id)
		.select()
		.single();

	if (updateError) {
		if (updateError.code === '23505') {
			return message(form, {
				status: 'error',
				text: `Cannot have the same name for sub core functions!`
			});
		}
		return message(form, {
			status: 'error',
			text: `Error saving IPCR ${updateError.message}`
		});
	}

	return { form, subCoreFunction };
}
