import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Database } from '$lib/types/database.types';
import { submitIPCRschema, type SubmitIPCRSchema } from '../schema/ipcr_submit_schema';
export async function submitIpcr(request: Request, supabase: SupabaseClient<Database>) {
	const form = await superValidate<Infer<SubmitIPCRSchema>, App.Superforms.Message>(
		request,
		zod(submitIPCRschema)
	);

	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	const { ipcrID } = form.data;
	const { data, error: errorIPCRValiadtion } = await supabase.rpc('validate_ipcr', {
		p_ipcr_id: ipcrID
	});

	if (errorIPCRValiadtion) {
		return message(form, {
			status: 'error',
			text: `error validating ipcr ${errorIPCRValiadtion.message}`
		});
	}

	// data will contain both is_valid and validation_message as properties
	if (!data.is_valid) {
		return message(form, {
			status: 'error',
			text: `IPCR incomplete: ${data.validation_message}`
		});
	}

	const { data: IpcrData, error: updateError } = await supabase
		.from('ipcr')
		.update({ status: 'submitted' })
		.eq('id', ipcrID)
		.select()
		.single();
	if (updateError) {
		return message(form, {
			status: 'error',
			text: `error submitting ipcr ${updateError.message}`
		});
	}

	return { form, IpcrData };
}
