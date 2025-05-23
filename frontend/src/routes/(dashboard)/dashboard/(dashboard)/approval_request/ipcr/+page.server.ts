import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fetchIpcrDetailsWithUserId, getActionForms } from './utils/server-loader';
import {
	setStatusReviewedRaw,
	setStatusReviewRaw,
	setStatusRevisionRaw
} from './utils/ipcr-raw-services';
import {
	setStatusApprove,
	setStatusReview,
	setStatusRevision
} from './utils/ipcr-non-raw-services';

export const load = (async ({ locals: { supabase, session } }) => {
	if (!session) {
		redirect(401, '/login');
	}
	const ipcrs = await fetchIpcrDetailsWithUserId(session.user.id, supabase);
	const actionForms = await getActionForms();
	return {
		actionForms,
		ipcrs
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	reviewraw: async ({ request, params, locals: { supabase, session } }) => {
		if (!session) {
			redirect(401, '/login');
		}
		return setStatusReviewRaw(request, supabase, session);
	},
	reviewedraw: async ({ request, params, locals: { supabase, session } }) => {
		if (!session) {
			redirect(401, '/login');
		}
		return setStatusReviewedRaw(request, supabase, session);
	},
	revisionraw: async ({ request, params, locals: { supabase, session } }) => {
		if (!session) {
			redirect(401, '/login');
		}
		return setStatusRevisionRaw(request, supabase, session);
	},
	//NON RAW FUNCTION
	review: async ({ request, params, locals: { supabase, session } }) => {
		if (!session) {
			redirect(401, '/login');
		}
		return setStatusReview(request, supabase, session);
	},
	revision: async ({ request, params, locals: { supabase, session } }) => {
		if (!session) {
			redirect(401, '/login');
		}
		return setStatusRevision(request, supabase, session);
	},
	approve: async ({ request, params, locals: { supabase, session } }) => {
		if (!session) {
			redirect(401, '/login');
		}
		return setStatusApprove(request, supabase, session);
	}
};
