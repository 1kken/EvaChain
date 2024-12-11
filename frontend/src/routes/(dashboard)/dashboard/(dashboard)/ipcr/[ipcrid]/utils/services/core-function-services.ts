import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createCoreFunctionSchema,
	deleteCoreFunctionSchema,
	updateCoreFunctionSchema,
	type CreateCoreFunctionSchema,
	type DeleteCoreFunctionSchema,
	type UpdateCoreFunctionSchema
} from '../schemas/core_function_schema';
import { titleCase } from 'title-case';
import type { SupabaseClient } from '@supabase/supabase-js';
import { zod } from 'sveltekit-superforms/adapters';

export async function createCoreFunction(request: Request, supabase: SupabaseClient) {
	const form = await superValidate<Infer<CreateCoreFunctionSchema>, App.Superforms.Message>(
		request,
		zod(createCoreFunctionSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	let { name, ipcr_id, unit, reviewer_id, position } = form.data;
	name = titleCase(name.toLocaleLowerCase());

	const { data: coreFunction, error: coreFunctionError } = await supabase
		.from('core_function')
		.insert({ name, ipcr_id, unit, reviewer_id, position })
		.select()
		.single();

	if (coreFunctionError) {
		if (coreFunctionError.code === '23505') {
			return message(form, {
				status: 'error',
				text: `Cannot have the same name for core functions!`
			});
		}
		return message(form, {
			status: 'error',
			text: `Error saving core function, ${coreFunctionError.message}`
		});
	}

	return { form, coreFunction };
}

export async function deleteCoreFunction(request: Request, supabase: SupabaseClient) {
	const form = await superValidate<Infer<DeleteCoreFunctionSchema>, App.Superforms.Message>(
		request,
		zod(deleteCoreFunctionSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id } = form.data;

	const { error: deleteError, data: coreFunction } = await supabase
		.from('core_function')
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

	return { form, coreFunction };
}

export async function updateCoreFunction(request: Request, supabase: SupabaseClient) {
	const form = await superValidate<Infer<UpdateCoreFunctionSchema>, App.Superforms.Message>(
		request,
		zod(updateCoreFunctionSchema)
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

	const { data: coreFunction, error: updateError } = await supabase
		.from('core_function')
		.update({ name, reviewer_id, unit })
		.eq('id', id)
		.select()
		.single();

	if (updateError) {
		if (updateError.code === '23505') {
			return message(form, {
				status: 'error',
				text: `Cannot have the same name for core functions!`
			});
		}
		return message(form, {
			status: 'error',
			text: `Error saving IPCR ${updateError.message}`
		});
	}

	return { form, coreFunction };
}
