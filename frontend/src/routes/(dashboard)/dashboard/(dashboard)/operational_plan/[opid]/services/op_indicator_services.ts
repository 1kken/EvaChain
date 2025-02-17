import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createOpActivityIndicatorSchema,
	updateOpActivityIndicatorSchema,
	type CreateOpActivityIndicatorSchema,
	type UpdateOpActivityIndicatorSchema
} from '../schema/op_indicator_schema';
import { zod } from 'sveltekit-superforms/adapters';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';

export async function createOpIndicator(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<CreateOpActivityIndicatorSchema>, App.Superforms.Message>(
		request,
		zod(createOpActivityIndicatorSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { data: opIndicator, error: opIndicatorError } = await supabase
		.from('op_activity_indicator')
		.insert({ ...form.data })
		.select()
		.single();
	if (opIndicatorError) {
		return message(form, {
			status: 'error',
			text: `Error saving objective indicator, ${opIndicatorError.message}`
		});
	}

	return { form, opIndicator };
}

export async function updateOpIndicator(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateOpActivityIndicatorSchema>, App.Superforms.Message>(
		request,
		zod(updateOpActivityIndicatorSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { data: opIndicator, error: opIndicatorError } = await supabase
		.from('op_activity_indicator')
		.update({ ...form.data })
		.eq('id', form.data.id)
		.select()
		.single();

	if (opIndicatorError) {
		return message(form, {
			status: 'error',
			text: `Error updating Objective Indicator, ${opIndicatorError.message}`
		});
	}

	return { form, opIndicator };
}

export async function deleteOpIndicator(request: Request, supabase: SupabaseClient<Database>) {
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

	const { data: opIndicator, error: opIndicatorError } = await supabase
		.from('op_activity_indicator')
		.delete()
		.eq('id', form.data.id)
		.select()
		.single();

	if (opIndicatorError) {
		return message(form, {
			status: 'error',
			text: `Error deleting Objective Indicator, ${opIndicatorError.message}`
		});
	}

	return { form, opIndicator };
}
