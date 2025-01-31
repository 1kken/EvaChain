import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';
import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createOpcrIndicatorSchema,
	updateOpcrIndicatorSchema,
	type CreateOpcrIndicatorSchema,
	type UpdateOpcrIndicatorSchema
} from '../schema/indicator_schema';

export async function createOpcrIndicator(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<CreateOpcrIndicatorSchema>, App.Superforms.Message>(
		request,
		zod(createOpcrIndicatorSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { data: opcrIndicator, error: opcrError } = await supabase
		.from('opcr_indicator')
		.insert({ ...form.data })
		.select()
		.single();

	if (opcrError) {
		return message(form, {
			status: 'error',
			text: `Error saving indicator: ${opcrError.message}`
		});
	}

	return { form, opcrIndicator };
}

export async function updateOpcrIndicator(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateOpcrIndicatorSchema>, App.Superforms.Message>(
		request,
		zod(updateOpcrIndicatorSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id, ...updateData } = form.data;

	const { data: opcrIndicator, error: opcrError } = await supabase
		.from('opcr_indicator')
		.update({ ...updateData })
		.eq('id', id)
		.select()
		.single();

	if (opcrError) {
		return message(form, {
			status: 'error',
			text: `Error updating indicator: ${opcrError.message}`
		});
	}

	return { form, opcrIndicator };
}

export async function deleteOpcrIndicator(request: Request, supabase: SupabaseClient<Database>) {
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

	const { data: opcrIndicator, error: opcrError } = await supabase
		.from('opcr_indicator')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (opcrError) {
		return message(form, {
			status: 'error',
			text: `Error deleting indicator: ${opcrError.message}`
		});
	}

	return { form, opcrIndicator };
}
