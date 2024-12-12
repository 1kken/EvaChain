import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createSubOtherFunctionSchema,
	updateSubOtherFunctionSchema,
	type CreateSubOtherFunctionSchema,
	type UpdateSubOtherFunctionSchema
} from '../schemas/sub_other_function_schema';
import { titleCase } from 'title-case';
import type { SupabaseClient } from '@supabase/supabase-js';
import { zod } from 'sveltekit-superforms/adapters';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '../schemas/universal_delete_schema';

export async function createSubOtherFunction(request: Request, supabase: SupabaseClient) {
	const form = await superValidate<Infer<CreateSubOtherFunctionSchema>, App.Superforms.Message>(
		request,
		zod(createSubOtherFunctionSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	let { name, other_function_id, position } = form.data;
	name = titleCase(name.toLocaleLowerCase());

	const { data: sub_other_function, error: subOtherFunctionError } = await supabase
		.from('sub_other_function')
		.insert({ name, other_function_id, position })
		.select()
		.single();

	if (subOtherFunctionError) {
		if (subOtherFunctionError.code === '23505') {
			return message(form, {
				status: 'error',
				text: `Cannot have the same name for sub other functions!`
			});
		}
		return message(form, {
			status: 'error',
			text: `Error saving sub other function, ${subOtherFunctionError.message}`
		});
	}

	return { form, sub_other_function };
}

export async function deleteSubOtherFunction(request: Request, supabase: SupabaseClient) {
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

	const { error: deleteError, data: sub_other_function } = await supabase
		.from('sub_other_function')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (deleteError) {
		return message(form, {
			status: 'error',
			text: `Error deleting sub other function ${deleteError.message}`
		});
	}

	return { form, sub_other_function };
}

export async function updateSubOtherFunction(request: Request, supabase: SupabaseClient) {
	const form = await superValidate<Infer<UpdateSubOtherFunctionSchema>, App.Superforms.Message>(
		request,
		zod(updateSubOtherFunctionSchema)
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

	const { data: sub_other_function, error: updateError } = await supabase
		.from('sub_other_function')
		.update({ name })
		.eq('id', id)
		.select()
		.single();

	if (updateError) {
		if (updateError.code === '23505') {
			return message(form, {
				status: 'error',
				text: `Cannot have the same name for sub other functions!`
			});
		}
		return message(form, {
			status: 'error',
			text: `Error updating sub other function ${updateError.message}`
		});
	}

	return { form, sub_other_function };
}
