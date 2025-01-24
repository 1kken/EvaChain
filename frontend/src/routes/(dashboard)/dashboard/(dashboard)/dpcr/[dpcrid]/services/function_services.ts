import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createDpcrFunctionSchema,
	updateDpcrFunctionSchema,
	type CreateDpcrFunctionSchema,
	type UpdateDpcrFunctionSchema
} from '../schema/function_schema';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'lucide-svelte';
import { zod } from 'sveltekit-superforms/adapters';
import { titleCase } from 'title-case';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';

export async function createDpcrFunction(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<CreateDpcrFunctionSchema>>(
		request,
		zod(createDpcrFunctionSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { position, dpcr_id, title } = form.data;

	const { data: dpcrFunction, error } = await supabase
		.from('dpcr_function')
		.insert({ position, dpcr_id, title: titleCase(title) })
		.select()
		.single();

	if (error) {
		return message(form, {
			status: 'error',
			text: `Error saving function: ${error.message}`
		});
	}

	return { form, dpcrFunction };
}

export async function updateDpcrFunction(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateDpcrFunctionSchema>>(
		request,
		zod(updateDpcrFunctionSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id, title } = form.data;

	const { data: dpcrFunction, error } = await supabase
		.from('dpcr_function')
		.update({ title: titleCase(title) })
		.eq('id', id)
		.select()
		.single();

	if (error) {
		return message(form, {
			status: 'error',
			text: `Error updating function: ${error.message}`
		});
	}

	return { form, dpcrFunction };
}

export async function deleteDpcrFunction(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UniversalDeleteSchema>>(
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

	const { data: dpcrFunction, error } = await supabase
		.from('dpcr_function')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (error) {
		return message(form, {
			status: 'error',
			text: `Error deleting function: ${error.message}`
		});
	}

	return { form, dpcrFunction };
}
