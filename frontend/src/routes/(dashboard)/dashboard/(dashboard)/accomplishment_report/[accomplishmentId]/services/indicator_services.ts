import { message, superValidate, type Infer } from 'sveltekit-superforms';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';
import { zod } from 'sveltekit-superforms/adapters';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';
import {
	createAccomplishmentActivityIndicatorSchema,
	updateAccomplishmentActivityIndicatorSchema,
	type CreateAccomplishmentActivityIndicatorSchema,
	type UpdateAccomplishmentActivityIndicatorSchema
} from '../schema/indicator_schema';

export async function createAccomplishmentActivityIndicator(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<
		Infer<CreateAccomplishmentActivityIndicatorSchema>,
		App.Superforms.Message
	>(request, zod(createAccomplishmentActivityIndicatorSchema));

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { data: accIndicator, error: accIndicatorError } = await supabase
		.from('accomplishment_activity_indicator')
		.insert({
			...form.data
		})
		.select()
		.single();

	if (accIndicatorError) {
		return message(form, {
			status: 'error',
			text: `Error saving indicator, ${accIndicatorError.message}`
		});
	}

	return { form, accIndicator };
}

export async function deleteAccomplishmentActivityIndicator(
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

	let { id } = form.data;

	const { data: accIndicator, error: accIndicatorError } = await supabase
		.from('accomplishment_activity_indicator')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (accIndicatorError) {
		return message(form, {
			status: 'error',
			text: `Error deleting indicator, ${accIndicatorError.message}`
		});
	}

	return { form, accIndicator };
}

export async function updateAccomplishmentActivityIndicator(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<
		Infer<UpdateAccomplishmentActivityIndicatorSchema>,
		App.Superforms.Message
	>(request, zod(updateAccomplishmentActivityIndicatorSchema));

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	let { id } = form.data;

	const { data: accIndicator, error: accIndicatorError } = await supabase
		.from('accomplishment_activity_indicator')
		.update({
			...form.data
		})
		.eq('id', id)
		.select()
		.single();

	if (accIndicatorError) {
		return message(form, {
			status: 'error',
			text: `Error updating indicator, ${accIndicatorError.message}`
		});
	}

	return { form, accIndicator };
}
