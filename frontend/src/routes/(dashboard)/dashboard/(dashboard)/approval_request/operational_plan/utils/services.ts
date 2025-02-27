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
import { createAccomplishmentFromOperationalPlan } from './mappingToAccomplishment';
import { hasRole } from '$lib/utils/rbacHelper';
import { generateDPCRFromOperationalPlan } from './mappingToDpcr';

export async function setStatusReview(
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

	const { id } = form.data;

	const { data: opData, error: opDataError } = await supabase
		.from('operational_plan')
		.update({ status: 'reviewing' })
		.eq('id', id)
		.select()
		.single();

	if (opDataError) {
		return message(form, {
			status: 'error',
			text: 'Error updating operational plan'
		});
	}

	const { data, error: notifError } = await supabase.from('notifications').insert({
		type: 'notification',
		title: 'Operational Plan Under Review',
		sender_id: session.user.id,
		receiver_id: opData?.creator_id,
		message: `Your operational plan titled ${opData?.title} is now under review`
	});

	if (notifError) {
		return message(form, {
			status: 'error',
			text: 'Error sending notification'
		});
	}

	return { form, opData };
}

export async function setStatusRevision(
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

	const { id, message: messageInput } = form.data;

	const { data: opData, error: opDataError } = await supabase
		.from('operational_plan')
		.update({ status: 'revision' })
		.eq('id', id)
		.select()
		.single();

	if (opDataError) {
		return message(form, {
			status: 'error',
			text: 'Error updating operational plan'
		});
	}

	const { data, error: notifError } = await supabase.from('notifications').insert({
		type: 'warning',
		title: `Operational Plan Revision Request for ${opData?.title}`,
		sender_id: session.user.id,
		receiver_id: opData?.creator_id,
		message: messageInput
	});

	if (notifError) {
		return message(form, {
			status: 'error',
			text: 'Error sending notification'
		});
	}

	return { form, opData };
}

export async function setStatusApproved(
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

	const { id } = form.data;

	// Begin a Supabase transaction
	const { data: opData, error: opDataError } = await supabase
		.from('operational_plan')
		.update({ status: 'approved' })
		.eq('id', id)
		.select()
		.single();

	if (opDataError) {
		return message(form, {
			status: 'error',
			text: 'Error updating operational plan'
		});
	}

	// After successful status update, create the accomplishment report
	const copyResult = await createAccomplishmentFromOperationalPlan(supabase, id);

	//! insert logic here for creating DPCR

	//* lets check first if shes has a role of head_of_opearting unit
	if (await hasRole(supabase, opData.creator_id, 'head_of_operating_unit')) {
		await generateDPCRFromOperationalPlan(supabase, {
			operationalPlanId: opData.id,
			userId: opData.creator_id
		});
	}

	if (!copyResult.success) {
		// If copying fails, we might want to revert the status update
		// or at least notify the user that the accomplishment report creation failed
		return message(form, {
			status: 'error',
			text: `Operational plan approved but failed to create accomplishment report: ${copyResult.message}`
		});
	}

	//NOTIF
	const { data, error: notifError } = await supabase.from('notifications').insert({
		type: 'success',
		title: 'Operational Plan Approved',
		sender_id: session.user.id,
		receiver_id: opData?.creator_id,
		message: `Your operational plan titled ${opData?.title} is now approved.`
	});

	if (notifError) {
		return message(form, {
			status: 'error',
			text: 'Error sending notification'
		});
	}

	return {
		form,
		opData,
		accomplishmentReportId: copyResult.accomplishmentReportId
	};
}
