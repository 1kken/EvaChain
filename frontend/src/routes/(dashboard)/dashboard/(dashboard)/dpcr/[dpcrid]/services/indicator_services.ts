import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';
import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createDpcrIndicatorSchema,
	updateDpcrIndicatorSchema,
	type CreateDpcrIndicatorSchema,
	type UpdateDpcrIndicatorSchema
} from '../schema/indicator_schema';

export async function createDpcrIndicator(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<CreateDpcrIndicatorSchema>, App.Superforms.Message>(
		request,
		zod(createDpcrIndicatorSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { data: dpcrIndicator, error: dpcrError } = await supabase
		.from('dpcr_indicator')
		.insert({ ...form.data })
		.select()
		.single();

	if (dpcrError) {
		return message(form, {
			status: 'error',
			text: `Error saving indicator: ${dpcrError.message}`
		});
	}

	return { form, dpcrIndicator };
}

export async function updateDpcrIndicator(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateDpcrIndicatorSchema>, App.Superforms.Message>(
		request,
		zod(updateDpcrIndicatorSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id, ...updateData } = form.data;

	const { data: dpcrIndicator, error: dpcrError } = await supabase
		.from('dpcr_indicator')
		.update({ ...updateData })
		.eq('id', id)
		.select()
		.single();

	if (dpcrError) {
		return message(form, {
			status: 'error',
			text: `Error updating indicator: ${dpcrError.message}`
		});
	}

	return { form, dpcrIndicator };
}

export async function deleteDpcrIndicator(request: Request, supabase: SupabaseClient<Database>) {
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

	const { data: dpcrIndicator, error: dpcrError } = await supabase
		.from('dpcr_indicator')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (dpcrError) {
		return message(form, {
			status: 'error',
			text: `Error deleting indicator: ${dpcrError.message}`
		});
	}

	return { form, dpcrIndicator };
}
