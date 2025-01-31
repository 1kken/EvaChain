import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createOpcrFunctionSchema,
	updateOpcrFunctionSchema,
	type CreateOpcrFunctionSchema,
	type UpdateOpcrFunctionSchema
} from '../schema/function_schema';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'lucide-svelte';
import { zod } from 'sveltekit-superforms/adapters';
import { titleCase } from 'title-case';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';

export async function createOpcrFunction(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<CreateOpcrFunctionSchema>>(
		request,
		zod(createOpcrFunctionSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { position, opcr_id, title } = form.data;

	const { data: opcrFunction, error } = await supabase
		.from('opcr_function')
		.insert({ position, opcr_id, title: titleCase(title) })
		.select()
		.single();

	if (error) {
		return message(form, {
			status: 'error',
			text: `Error saving function: ${error.message}`
		});
	}

	return { form, opcrFunction };
}

export async function updateOpcrFunction(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateOpcrFunctionSchema>>(
		request,
		zod(updateOpcrFunctionSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id, title } = form.data;

	const { data: opcrFunction, error } = await supabase
		.from('opcr_function')
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

	return { form, opcrFunction };
}

export async function deleteOpcrFunction(request: Request, supabase: SupabaseClient<Database>) {
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

	const { data: opcrFunction, error } = await supabase
		.from('opcr_function')
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

	return { form, opcrFunction };
}
