import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createOtherFunctionSchema,
	updateOtherFunctionSchema,
	type CreateOtherFunctionSchema,
	type UpdateOtherFunctionSchema
} from '../schemas/other_function_schema';
import { titleCase } from 'title-case';
import type { SupabaseClient } from '@supabase/supabase-js';
import { zod } from 'sveltekit-superforms/adapters';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '../schemas/universal_delete_schema';

export async function createOtherFunction(request: Request, supabase: SupabaseClient) {
	const form = await superValidate<Infer<CreateOtherFunctionSchema>, App.Superforms.Message>(
		request,
		zod(createOtherFunctionSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	let { name, ipcr_id, unit, reviewer_id, position } = form.data;
	name = titleCase(name.toLocaleLowerCase());

	const { data: other_function, error: otherFunctionError } = await supabase
		.from('other_function')
		.insert({ name, ipcr_id, unit, reviewer_id, position })
		.select()
		.single();

	if (otherFunctionError) {
		if (otherFunctionError.code === '23505') {
			return message(form, {
				status: 'error',
				text: `Cannot have the same name for other functions!`
			});
		}
		return message(form, {
			status: 'error',
			text: `Error saving other function, ${otherFunctionError.message}`
		});
	}

	return { form, other_function };
}

export async function deleteOtherFunction(request: Request, supabase: SupabaseClient) {
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

	const { error: deleteError, data: other_function } = await supabase
		.from('other_function')
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

	return { form, other_function };
}

export async function updateOtherFunction(request: Request, supabase: SupabaseClient) {
	const form = await superValidate<Infer<UpdateOtherFunctionSchema>, App.Superforms.Message>(
		request,
		zod(updateOtherFunctionSchema)
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

	const { data: other_function, error: updateError } = await supabase
		.from('other_function')
		.update({ name, reviewer_id, unit })
		.eq('id', id)
		.select()
		.single();

	if (updateError) {
		if (updateError.code === '23505') {
			return message(form, {
				status: 'error',
				text: `Cannot have the same name for other functions!`
			});
		}
		return message(form, {
			status: 'error',
			text: `Error saving IPCR ${updateError.message}`
		});
	}

	return { form, other_function };
}
