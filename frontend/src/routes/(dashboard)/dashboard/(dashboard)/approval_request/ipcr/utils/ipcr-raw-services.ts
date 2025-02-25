import type { Database } from '$lib/types/database.types';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	revisionSchema,
	uuidSchema,
	type RevisionSchema,
	type UuidSchema
} from '../(data)/zod_schema';
import { zod } from 'sveltekit-superforms/adapters';

export async function setStatusReviewRaw(
	request: Request,
	supabase: SupabaseClient<Database>,
	session: Session
) {
	const form = await superValidate<Infer<UuidSchema>, App.Superforms.Message>(
		request,
		zod(uuidSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	//this is ipcr_immediate_super_visor id
	const { id } = form.data;

	//update the status of the ipcr_immediate_supervisor
	const { data: imSp, error: imSpError } = await supabase
		.from('ipcr_immediate_supervisor')
		.update({ status: 'under_review_raw' })
		.eq('id', id)
		.select()
		.single();

	if (imSpError) {
		return message(form, {
			status: 'error',
			text: 'Error updating IPCR immediate supervisor!'
		});
	}

	//get ipcr_supervisor_details_view
	const { data: imSpDetails, error: imSpErrors } = await supabase
		.from('ipcr_supervisor_details_view')
		.select()
		.eq('supervisor_relationship_id', imSp.id)
		.limit(1)
		.single();

	if (imSpErrors) {
		return message(form, {
			status: 'error',
			text: 'Error fetching IPCR immediate supervisor details!'
		});
	}

	const { data: notfication, error: notifError } = await supabase.from('notifications').insert({
		type: 'notification',
		title: 'IPCR Under Review',
		sender_id: session.user.id,
		receiver_id: imSpDetails.owner_id,
		message: `Your IPCR titled ${imSpDetails.ipcr_title} is now under review by ${imSpDetails.supervisor_full_name} `
	});

	if (notifError) {
		return message(form, {
			status: 'error',
			text: 'Error sending notification'
		});
	}

	return { form };
}

export async function setStatusReviewedRaw(
	request: Request,
	supabase: SupabaseClient<Database>,
	session: Session
) {
	const form = await superValidate<Infer<UuidSchema>, App.Superforms.Message>(
		request,
		zod(uuidSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	//this is ipcr_immediate_super_visor id
	const { id } = form.data;

	//update the status of the ipcr_immediate_supervisor
	const { data: imSp, error: imSpError } = await supabase
		.from('ipcr_immediate_supervisor')
		.update({ status: 'reviewed_raw' })
		.eq('id', id)
		.select()
		.single();

	if (imSpError) {
		return message(form, {
			status: 'error',
			text: 'Error updating IPCR immediate supervisor!'
		});
	}

	//get ipcr_supervisor_details_view
	const { data: imSpDetails, error: imSpErrors } = await supabase
		.from('ipcr_supervisor_details_view')
		.select()
		.eq('supervisor_relationship_id', imSp.id)
		.limit(1)
		.single();

	if (imSpErrors) {
		return message(form, {
			status: 'error',
			text: 'Error fetching IPCR immediate supervisor details!'
		});
	}

	const { data: notfication, error: notifError } = await supabase.from('notifications').insert({
		type: 'notification',
		title: 'IPCR Reviewed',
		sender_id: session.user.id,
		receiver_id: imSpDetails.owner_id,
		message: `Your IPCR titled ${imSpDetails.ipcr_title} is now reviewed by ${imSpDetails.supervisor_full_name}. \n
        You can now start uploading your accomplishments and self-rating.`
	});

	if (notifError) {
		return message(form, {
			status: 'error',
			text: 'Error sending notification'
		});
	}

	return { form };
}

export async function setStatusRevisionRaw(
	request: Request,
	supabase: SupabaseClient<Database>,
	session: Session
) {
	const form = await superValidate<Infer<RevisionSchema>, App.Superforms.Message>(
		request,
		zod(revisionSchema)
	);
	if (!form.valid) {
		return message(form, {
			status: 'error',
			text: 'Unprocessable input!'
		});
	}

	//this is ipcr_immediate_super_visor id
	const { id, message: messageInput } = form.data;

	//update the status of the ipcr_immediate_supervisor
	const { data: imSp, error: imSpError } = await supabase
		.from('ipcr_immediate_supervisor')
		.update({ status: 'revision_raw' })
		.eq('id', id)
		.select()
		.single();

	if (imSpError) {
		return message(form, {
			status: 'error',
			text: 'Error updating IPCR immediate supervisor!'
		});
	}

	//get ipcr_supervisor_details_view
	const { data: imSpDetails, error: imSpErrors } = await supabase
		.from('ipcr_supervisor_details_view')
		.select()
		.eq('supervisor_relationship_id', imSp.id)
		.limit(1)
		.single();

	if (imSpErrors) {
		return message(form, {
			status: 'error',
			text: 'Error fetching IPCR immediate supervisor details!'
		});
	}

	const { data: notfication, error: notifError } = await supabase.from('notifications').insert({
		type: 'warning',
		title: 'IPCR Revision Request',
		sender_id: session.user.id,
		receiver_id: imSpDetails.owner_id,
		message: `Your IPCR, titled '${imSpDetails.ipcr_title},'
        has been reviewed by ${imSpDetails.supervisor_full_name}.
        And Concluded that Revisions are required.
        Please review the feedback and make the necessary updates accordingly.\n comments: ${messageInput}`
	});

	if (notifError) {
		return message(form, {
			status: 'error',
			text: 'Error sending notification'
		});
	}

	return { form };
}
