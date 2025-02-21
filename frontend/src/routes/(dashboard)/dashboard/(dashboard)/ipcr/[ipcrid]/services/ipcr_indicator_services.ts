import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, withFiles, type Infer } from 'sveltekit-superforms';
import {
	createIpcrIndicatorSchema,
	updateIpcrIndicatorSchema,
	type CreateIpcrIndicatorSchema,
	type UpdateIpcrIndicatorSchema
} from '../schema/ipcr_indicator_schema';
import { zod } from 'sveltekit-superforms/adapters';
import {
	universalDeleteSchema,
	type UniversalDeleteSchema
} from '$lib/schemas/universal_delete_schema';

export async function createIpcrIndicator(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<CreateIpcrIndicatorSchema>, App.Superforms.Message>(
		request,
		zod(createIpcrIndicatorSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { data: ipcrFunctionIndicator, error: ipcrError } = await supabase
		.from('ipcr_indicator')
		.insert({ ...form.data })
		.select()
		.single();

	if (ipcrError) {
		return message(form, {
			status: 'error',
			text: `Error saving indicator: ${ipcrError.message}`
		});
	}

	return { form, ipcrFunctionIndicator };
}

export async function updateIpcrIndicator(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<UpdateIpcrIndicatorSchema>, App.Superforms.Message>(
		request,
		zod(updateIpcrIndicatorSchema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { id, ...updateData } = form.data;

	const { data: ipcrFunctionIndicator, error: ipcrError } = await supabase
		.from('ipcr_indicator')
		.update({ ...updateData })
		.eq('id', id)
		.select()
		.single();

	if (ipcrError) {
		return message(form, {
			status: 'error',
			text: `Error updating indicator: ${ipcrError.message}`
		});
	}

	return { form, ipcrFunctionIndicator };
}

export async function deleteIpcrIndicator(request: Request, supabase: SupabaseClient<Database>) {
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

	const { data: ipcrFunctionIndicator, error: ipcrError } = await supabase
		.from('ipcr_indicator')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (ipcrError) {
		console.log('here');
		return message(form, {
			status: 'error',
			text: `Error deleting indicator: ${ipcrError.message}`
		});
	}

	return { form, ipcrFunctionIndicator };
}
