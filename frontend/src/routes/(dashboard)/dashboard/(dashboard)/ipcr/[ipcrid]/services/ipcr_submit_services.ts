import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Database } from '$lib/types/database.types';
import { submitIPCRschema, type SubmitIPCRSchema } from '../schema/ipcr_submit_schema';
export async function submitIpcr(
	request: Request,
	supabase: SupabaseClient<Database>,
	session: Session
) {
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
		.update({ status: 'submitted_raw' })
		.eq('id', ipcrID)
		.select()
		.single();
	if (updateError) {
		return message(form, {
			status: 'error',
			text: `error submitting ipcr ${updateError.message}`
		});
	}

	const { data: ipcrSupervisor, error: ipcrSupervisorError } = await supabase
		.from('ipcr_immediate_supervisor')
		.select()
		.eq('ipcr_id', ipcrID)
		.limit(1);

	if (ipcrSupervisorError) {
		return message(form, {
			status: 'error',
			text: `error fetching ipcr immediate supervisor ${ipcrSupervisorError.message}`
		});
	}

	console.log(ipcrSupervisor);
	if (ipcrSupervisor.length === 0) {
		const { data: makingSupervisorData, error: createSupervisorError } = await supabase.rpc(
			'create_supervisor_data',
			{
				p_ipcr_id: ipcrID
			}
		);
		if (createSupervisorError) {
			return message(form, {
				status: 'error',
				text: `error creating supervisor data ${createSupervisorError.message}`
			});
		}
		const ipcrImmediateSupervisor = makingSupervisorData.map((supervisor) => {
			return {
				receiver_id: supervisor.supervisor_id,
				sender_id: session.user.id,
				type: 'notification' as const,
				title:
					'You have been assigned as the immediate supervisor for the submitted IPCR ' +
					IpcrData.title,
				message: `You have been assigned as the immediate supervisor for the submitted IPCR ${IpcrData.title}.`
			};
		});

		const { data: notificationData, error: notificationError } = await supabase
			.from('notifications')
			.insert([...ipcrImmediateSupervisor]);

		if (notificationError) {
			return message(form, {
				status: 'error',
				text: `error creating notification ${notificationError.message}`
			});
		}
	}

	return { form, IpcrData };
}
