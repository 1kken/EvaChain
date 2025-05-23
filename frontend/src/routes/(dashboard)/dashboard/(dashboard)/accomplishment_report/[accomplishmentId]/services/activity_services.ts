import { message, superValidate, type Infer } from 'sveltekit-superforms';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';
import { zod } from 'sveltekit-superforms/adapters';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';
import {
	createAccomplishmentActivitySchema,
	updateAccomplishmentActivitySchema,
	type CreateAccomplishmentActivitySchema,
	type UpdateAccomplishmentActivitySchema
} from '../schema/activity_schema';

export async function createAccomplishmentActivity(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<
		Infer<CreateAccomplishmentActivitySchema>,
		App.Superforms.Message
	>(request, zod(createAccomplishmentActivitySchema));

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { data: accActivity, error: accActivityError } = await supabase
		.from('accomplishment_activity')
		.insert({
			...form.data
		})
		.select()
		.single();

	if (accActivityError) {
		return message(form, {
			status: 'error',
			text: `Error saving activity, ${accActivityError.message}`
		});
	}

	return { form, accActivity };
}

export async function deleteAccomplishmentActivity(
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

	const { data: accActivity, error: accActivityError } = await supabase
		.from('accomplishment_activity')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (accActivityError) {
		return message(form, {
			status: 'error',
			text: `Error deleting activity, ${accActivityError.message}`
		});
	}

	return { form, accActivity };
}

export async function updateAccomplishmentActivity(
	request: Request,
	supabase: SupabaseClient<Database>
) {
	const form = await superValidate<
		Infer<UpdateAccomplishmentActivitySchema>,
		App.Superforms.Message
	>(request, zod(updateAccomplishmentActivitySchema));

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	let { id, activity } = form.data;

	const { data: accActivity, error: accActivityError } = await supabase
		.from('accomplishment_activity')
		.update({
			...form.data
		})
		.eq('id', id)
		.select()
		.single();

	if (accActivityError) {
		return message(form, {
			status: 'error',
			text: `Error updating activity, ${accActivityError.message}`
		});
	}

	return { form, accActivity };
}
