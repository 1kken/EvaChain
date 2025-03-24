import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	createAccomplishmentReport,
	deleteAccomplishmentReport,
	updateAccomplishmentReport
} from './(data)/accomp_services';
import { getAccReportForms } from './(data)/services_helper';
import { getAccomplishmentReport } from './(data)/utils';

export const load = (async ({ locals: { supabase, session } }) => {
	try {
		const user_id = session?.user.id;
		if (!user_id) {
			throw error(401, 'Unauthorized');
		}

		const accReport = getAccomplishmentReport(supabase, user_id);
		const [accReportForm] = await Promise.all([getAccReportForms()]);

		return {
			accReport,
			accReportForm
		};
	} catch (e) {
		console.error('Error loading accomplishment report data:', e);
		throw error(500, 'Failed to load accomplishment report data');
	}
}) satisfies PageServerLoad;

//actions

//actions
export const actions = {
	createaccreport: async ({ request, locals: { supabase, session } }) => {
		if (!session) {
			return { status: 401, body: 'Unauthorized' };
		}
		return createAccomplishmentReport(request, session, supabase);
	},
	deleteaccreport: async ({ request, locals: { supabase } }) => {
		return deleteAccomplishmentReport(request, supabase);
	},
	updateaccreport: async ({ request, locals: { supabase } }) => {
		return updateAccomplishmentReport(request, supabase);
	}
} satisfies Actions;
