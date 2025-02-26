import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	updateIpcrIndicatorSchema,
	type UpdateIpcrIndicatorSchema
} from '../schema/indicator_schema';
import { zod } from 'sveltekit-superforms/adapters';
import type { Database } from '$lib/types/database.types';

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
