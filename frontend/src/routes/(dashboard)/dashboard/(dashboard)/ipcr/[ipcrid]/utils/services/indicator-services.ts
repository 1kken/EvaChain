import {
	createIndicatorSchema,
	markIndicatorDoneSchema,
	updateIndicatorSchema,
	type CreateIndicatorSchema,
	type MarkIndicatorDoneSchema,
	type UpdateIndicatorSchema
} from '../schemas/indicator_schema';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '../schemas/universal_delete_schema';

import { message, superValidate, type Infer } from 'sveltekit-superforms';
import type { SupabaseClient } from '@supabase/supabase-js';
import { zod } from 'sveltekit-superforms/adapters';
export async function createIndicator(request: Request, supabase: SupabaseClient) {
	const form = await superValidate<Infer<CreateIndicatorSchema>, App.Superforms.Message>(
		request,
		zod(createIndicatorSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	let { indicator, core_function_id, sub_core_function_id, position } = form.data;

	const { data: indicatorData, error: indicatorError } = await supabase
		.from('indicator')
		.insert({ indicator, core_function_id, sub_core_function_id, position })
		.select()
		.single();

	if (indicatorError) {
		return message(form, {
			status: 'error',
			text: `Error saving core function, ${indicatorError.message}`
		});
	}

	return { form, indicatorData };
}

export async function deleteIndicator(request: Request, supabase: SupabaseClient) {
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

	const { error: deleteError, data: indicatorData } = await supabase
		.from('indicator')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (deleteError) {
		console.log(deleteError.message);
		return message(form, {
			status: 'error',
			text: `Error saving IPCR ${deleteError.message}`
		});
	}

	return { form, indicatorData };
}

export async function updateIndicator(request: Request, supabase: SupabaseClient) {
	const form = await superValidate<Infer<UpdateIndicatorSchema>, App.Superforms.Message>(
		request,
		zod(updateIndicatorSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id, indicator } = form.data;

	const { error: updateError, data: indicatorData } = await supabase
		.from('indicator')
		.update({ indicator })
		.eq('id', id)
		.select()
		.single();

	if (updateError) {
		console.log(updateError.message);
		return message(form, {
			status: 'error',
			text: `Error saving IPCR ${updateError.message}`
		});
	}

	return { form, indicatorData };
}
export async function markIndicatorDone(request: Request, supabase: SupabaseClient) {
	const form = await superValidate<Infer<MarkIndicatorDoneSchema>, App.Superforms.Message>(
		request,
		zod(markIndicatorDoneSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id, accomplishment, accomplishment_date } = form.data;

	const { error: updateError, data: indicatorData } = await supabase
		.from('indicator')
		.update({ accomplishment, accomplishment_date, status: 'submitted' })
		.eq('id', id)
		.select()
		.single();

	if (updateError) {
		console.log(updateError.message);
		return message(form, {
			status: 'error',
			text: `Error saving IPCR ${updateError.message}`
		});
	}

	return { form, indicatorData };
}
