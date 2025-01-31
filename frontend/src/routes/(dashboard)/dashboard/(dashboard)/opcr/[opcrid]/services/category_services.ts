import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createOpcrCategorySchema,
	updateOpcrCategorySchema,
	type CreateOpcrCategorySchema,
	type UpdateOpcrCategorySchema
} from '../schema/category_schema';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'lucide-svelte';
import { zod } from 'sveltekit-superforms/adapters';
import { titleCase } from 'title-case';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';

export async function createOpcrCategory(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<CreateOpcrCategorySchema>>(
		request,
		zod(createOpcrCategorySchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { position, opcr_function_id, category } = form.data;

	const { data: opcrCategory, error } = await supabase
		.from('opcr_function_category')
		.insert({ position, opcr_function_id, category: titleCase(category) })
		.select()
		.single();

	if (error) {
		return message(form, {
			status: 'error',
			text: `Error saving category: ${error.message}`
		});
	}

	return { form, opcrCategory };
}

export async function updateOpcrCategory(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateOpcrCategorySchema>>(
		request,
		zod(updateOpcrCategorySchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id, category } = form.data;

	const { data: opcrCategory, error } = await supabase
		.from('opcr_function_category')
		.update({ category: titleCase(category) })
		.eq('id', id)
		.select()
		.single();

	if (error) {
		return message(form, {
			status: 'error',
			text: `Error updating category: ${error.message}`
		});
	}

	return { form, opcrCategory };
}

export async function deleteOpcrCategory(request: Request, supabase: SupabaseClient<Database>) {
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

	const { data: opcrCategory, error } = await supabase
		.from('opcr_function_category')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (error) {
		return message(form, {
			status: 'error',
			text: `Error deleting category: ${error.message}`
		});
	}

	return { form, opcrCategory };
}
