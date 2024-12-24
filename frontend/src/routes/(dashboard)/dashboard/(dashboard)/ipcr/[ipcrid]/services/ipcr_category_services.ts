import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createIpcrFunctionCategorySchema,
	updateIpcrFunctionCategorySchema,
	type CreateIpcrFunctionCategorySchema,
	type UpdateIpcrFunctionCategorySchema
} from '../schema/ipcr_category_schema';
import { zod } from 'sveltekit-superforms/adapters';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';

export async function createIpcrFunctionCategory(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<Infer<CreateIpcrFunctionCategorySchema>, App.Superforms.Message>(
		request,
		zod(createIpcrFunctionCategorySchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	const { data: ipcrFunctionCategory, error: ipcrFunctionCategoryError } = await supabase
		.from('ipcr_function_category')
		.insert({ ...form.data })
		.select()
		.single();
	if (ipcrFunctionCategoryError) {
		return message(form, {
			status: 'error',
			text: `Error saving header , ${ipcrFunctionCategoryError.message}`
		});
	}

	return { form, ipcrFunctionCategory };
}

//update
export async function updateIpcrFunctionCategory(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<Infer<UpdateIpcrFunctionCategorySchema>, App.Superforms.Message>(
		request,
		zod(updateIpcrFunctionCategorySchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	const { data: ipcrFunctionCategory, error: ipcrFunctionCategoryError } = await supabase
		.from('ipcr_function_category')
		.update({ ...form.data })
		.eq('id', form.data.id)
		.select()
		.single();

	if (ipcrFunctionCategoryError) {
		return message(form, {
			status: 'error',
			text: `Error saving header , ${ipcrFunctionCategoryError.message}`
		});
	}

	return { form, ipcrFunctionCategory };
}

//delete
export async function deleteIpcrFunctionCategory(
	request: Request,
	supabase: SupabaseClient<Database>
) {
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
	const { data: ipcrFunctionCategory, error: ipcrFunctionCategoryError } = await supabase
		.from('ipcr_function_category')
		.delete()
		.eq('id', form.data.id)
		.select()
		.single();

	if (ipcrFunctionCategoryError) {
		return message(form, {
			status: 'error',
			text: `Error saving header , ${ipcrFunctionCategoryError.message}`
		});
	}

	return { form, ipcrFunctionCategory };
}
