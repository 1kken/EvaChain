import {
	createSubSupportFunctionSchema,
	updateSubSupportFunctionSchema,
	type CreateSubSupportFunctionSchema,
	type UpdateSubSupportFunctionSchema
} from '../schemas/sub_support_function_schema';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { titleCase } from 'title-case';
import type { SupabaseClient } from '@supabase/supabase-js';
import { zod } from 'sveltekit-superforms/adapters';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '../schemas/universal_delete_schema';

export async function createSubSupportFunction(request: Request, supabase: SupabaseClient) {
	const form = await superValidate<Infer<CreateSubSupportFunctionSchema>, App.Superforms.Message>(
		request,
		zod(createSubSupportFunctionSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	let { name, position, support_function_id } = form.data;
	name = titleCase(name.toLocaleLowerCase());

	const { data: sub_support_function, error: errorSubSupportFunction } = await supabase
		.from('sub_support_function')
		.insert({ name, position, support_function_id })
		.select()
		.single();

	if (errorSubSupportFunction) {
		if (errorSubSupportFunction.code === '23505') {
			return message(form, {
				status: 'error',
				text: `Cannot have the same name for sub support functions!`
			});
		}
		return message(form, {
			status: 'error',
			text: `Error saving support function, ${errorSubSupportFunction.message}`
		});
	}

	return { form, sub_support_function };
}

export async function deleteSubSupportFunction(request: Request, supabase: SupabaseClient) {
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

	const { id } = form.data;

	const { error: deleteError, data: sub_support_function } = await supabase
		.from('sub_support_function')
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

	return { form, sub_support_function };
}

export async function updateSubSupportFunction(request: Request, supabase: SupabaseClient) {
	const form = await superValidate<Infer<UpdateSubSupportFunctionSchema>, App.Superforms.Message>(
		request,
		zod(updateSubSupportFunctionSchema)
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

	const { data: sub_support_function, error: updateError } = await supabase
		.from('sub_support_function')
		.update({ name })
		.eq('id', id)
		.select()
		.single();

	if (updateError) {
		if (updateError.code === '23505') {
			return message(form, {
				status: 'error',
				text: `Cannot have the same name for sub support functions!`
			});
		}
		return message(form, {
			status: 'error',
			text: `Error saving IPCR ${updateError.message}`
		});
	}

	return { form, sub_support_function };
}
