import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createDpcrCategorySchema,
	updateDpcrCategorySchema,
	type CreateDpcrCategorySchema,
	type UpdateDpcrCategorySchema
} from '../schema/category_schema';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'lucide-svelte';
import { zod } from 'sveltekit-superforms/adapters';
import { titleCase } from 'title-case';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';

export async function createDpcrCategory(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<CreateDpcrCategorySchema>>(
		request,
		zod(createDpcrCategorySchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { position, dpcr_function_id, category } = form.data;

	const { data: dpcrCategory, error } = await supabase
		.from('dpcr_function_category')
		.insert({ position, dpcr_function_id, category: titleCase(category) })
		.select()
		.single();

	if (error) {
		return message(form, {
			status: 'error',
			text: `Error saving category: ${error.message}`
		});
	}

	return { form, dpcrCategory };
}

export async function updateDpcrCategory(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateDpcrCategorySchema>>(
		request,
		zod(updateDpcrCategorySchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id, category } = form.data;

	const { data: dpcrCategory, error } = await supabase
		.from('dpcr_function_category')
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

	return { form, dpcrCategory };
}

export async function deleteDpcrCategory(request: Request, supabase: SupabaseClient<Database>) {
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

	const { data: dpcrCategory, error } = await supabase
		.from('dpcr_function_category')
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

	return { form, dpcrCategory };
}
