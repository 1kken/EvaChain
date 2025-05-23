import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Database, Tables } from '$lib/types/database.types';
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

	//fetch ipcr data
	const { data: ipcrData, error: ipcrError } = await supabase
		.from('ipcr')
		.select()
		.eq('id', ipcrID)
		.single();

	if (ipcrError) {
		return message(form, {
			status: 'error',
			text: `error fetching ipcr data ${ipcrError.message}`
		});
	}

	let ipcrDataUpdated: Tables<'ipcr'> | null = null;
	if (ipcrData.status === 'reviewed_raw' || ipcrData.status === 'revision') {
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
		ipcrDataUpdated = IpcrData;
	} else {
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
		ipcrDataUpdated = IpcrData;
	}

	if (!ipcrDataUpdated) {
		return message(form, {
			status: 'error',
			text: `error updating ipcr data`
		});
	}

	const { data: makingSupervisorData, error: createSupervisorError } = await supabase.rpc(
		'sync_ipcr_supervisors',
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
	console.log('makingSupervisorData', makingSupervisorData[0]);

	const ipcrImmediateSupervisor = makingSupervisorData
		.filter(
			(supervisor) => supervisor.sup_action === 'removed' || supervisor.sup_action === 'added'
		)
		.map((supervisor) => ({
			receiver_id: supervisor.sup_id,
			sender_id: session.user.id,
			type: supervisor.sup_action === 'removed' ? ('warning' as const) : ('notification' as const),
			title: `You have been "${supervisor.sup_action}" as the immediate supervisor for the IPCR titled ${ipcrDataUpdated.title}`,
			message: `You have been assigned as the immediate supervisor for the submitted IPCR ${ipcrDataUpdated.title}.`
		}));

	const { data: notificationData, error: notificationError } = await supabase
		.from('notifications')
		.insert([...ipcrImmediateSupervisor]);

	if (notificationError) {
		return message(form, {
			status: 'error',
			text: `error creating notification ${notificationError.message}`
		});
	}

	return { form, IpcrData: ipcrDataUpdated };
}
