import type { SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { submitIPCRschema, type SubmitIPCRSchema } from '../schemas/submit_ipcr_schema';
import { zod } from 'sveltekit-superforms/adapters';
export async function submitIpcrAction(request: Request, supabase: SupabaseClient) {
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
