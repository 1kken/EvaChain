import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';
import {
	createIpcrFunctionSubCategorySchema,
	updateIpcrFunctionSubCategorySchema,
	type CreateIpcrFunctionSubCategorySchema,
	type UpdateIpcrFunctionSubCategorySchema
} from '../schema/ipcr_sub_category_schema';

export async function createIpcrFunctionSubCategory(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<
		Infer<CreateIpcrFunctionSubCategorySchema>,
		App.Superforms.Message
	>(request, zod(createIpcrFunctionSubCategorySchema));
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	const { data: ipcrFunctionSubCategory, error: ipcrFunctionSubCategoryError } = await supabase
		.from('ipcr_function_sub_category')
		.insert({ ...form.data })
		.select()
		.single();

	if (ipcrFunctionSubCategoryError) {
		return message(form, {
			status: 'error',
			text: `Error saving header , ${ipcrFunctionSubCategoryError.message}`
		});
	}

	return { form, ipcrFunctionSubCategory };
}

//update
export async function updateIpcrFunctionSubCategory(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<
		Infer<UpdateIpcrFunctionSubCategorySchema>,
		App.Superforms.Message
	>(request, zod(updateIpcrFunctionSubCategorySchema));

	if (!form.valid) {
		console.log('form', form);
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}
	const { data: ipcrFunctionSubCategory, error: ipcrFunctionSubCategoryError } = await supabase
		.from('ipcr_function_sub_category')
		.update({ ...form.data })
		.eq('id', form.data.id)
		.select()
		.single();

	if (ipcrFunctionSubCategoryError) {
		console.log('here');
		return message(form, {
			status: 'error',
			text: `Error saving header , ${ipcrFunctionSubCategoryError.message}`
		});
	}

	return { form, ipcrFunctionSubCategory };
}

//delete
export async function deleteIpcrFunctionSubCategory(
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
	const { data: ipcrFunctionSubCategory, error: ipcrFunctionSubCategoryError } = await supabase
		.from('ipcr_function_sub_category')
		.delete()
		.eq('id', form.data.id)
		.select()
		.single();

	if (ipcrFunctionSubCategoryError) {
		return message(form, {
			status: 'error',
			text: `Error saving header , ${ipcrFunctionSubCategoryError.message}`
		});
	}

	return { form, ipcrFunctionSubCategory };
}
