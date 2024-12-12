import type { SupabaseClient } from '@supabase/supabase-js';
import {
	createSupportFunctionSchema,
	updateSupportFunctionSchema,
	type CreateSuppportFunctionSchema,
	type UpdateSupportFunctionSchema
} from '../schemas/support_function_schema';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { titleCase } from 'title-case';
import type { Database } from '$lib/types/database.types';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '../schemas/universal_delete_schema';

export async function createSupportFunction(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<CreateSuppportFunctionSchema>, App.Superforms.Message>(
		request,
		zod(createSupportFunctionSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	let { name, ipcr_id, unit, reviewer_id, position } = form.data;
	name = titleCase(name.toLocaleLowerCase());

	const { data: support_function, error: createError } = await supabase
		.from('support_function')
		.insert({ name, ipcr_id, unit, reviewer_id, position })
		.select()
		.single();

	if (createError) {
		if (createError.code === '23505') {
			return message(form, {
				status: 'error',
				text: `Cannot have the same title for support functions!`
			});
		}
		return message(form, {
			status: 'error',
			text: `Error saving support function, ${createError.message}`
		});
	}

	return { form, support_function };
}

export async function deleteSupportFunction(request: Request, supabase: SupabaseClient<Database>) {
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

	const { error: deleteError, data: support_function } = await supabase
		.from('support_function')
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

	return { form, support_function };
}
export async function updateSupportFunction(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateSupportFunctionSchema>, App.Superforms.Message>(
		request,
		zod(updateSupportFunctionSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	let { id, name, reviewer_id, unit } = form.data;
	if (name) {
		name = titleCase(name.toLocaleLowerCase());
	}

	const { data: support_function, error: updateError } = await supabase
		.from('support_function')
		.update({ name, reviewer_id, unit })
		.eq('id', id)
		.select()
		.single();

	if (updateError) {
		if (updateError.code === '23505') {
			return message(form, {
				status: 'error',
				text: `Cannot have the same name for support functions!`
			});
		}
		return message(form, {
			status: 'error',
			text: `Error saving IPCR ${updateError.message}`
		});
	}

	return { form, support_function };
}
