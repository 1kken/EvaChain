import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fetchIpcrDetailsWithUserId, getActionForms } from './utils/server-loader';
import {
	setStatusReviewedRaw,
	setStatusReviewRaw,
	setStatusRevisionRaw
} from './utils/ipcr-raw-services';

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
	}
};
