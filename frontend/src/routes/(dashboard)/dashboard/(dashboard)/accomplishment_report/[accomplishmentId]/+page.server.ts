import type { Actions, PageServerLoad } from './$types';
import {
	createAccomplishmentActivity,
	deleteAccomplishmentActivity,
	updateAccomplishmentActivity
} from './services/activity_services';
import {
	createAccomplishmentAnnualPlan,
	deleteAccomplishmentAnnualPlan,
	updateAccomplishmentAnnualPlan
} from './services/annual_plan_services';
import {
	createAccomplishmentHeader,
	deleteAccomplishmentHeader,
	updateAccomplishmentHeader
} from './services/header_services';
import {
	getAccomplishmentActivityForms,
	getAccomplishmentAnnualPlanForms,
	getAccomplishmentHeaderForms,
	getAccomplishmentHeaders,
	getCurrentAccomplishmentReport
} from './utils/page_server_loader_helper';

export const load = (async ({ params, locals: { supabase, session } }) => {
	const accomplishmentId = params.accomplishmentId;

	//data
	const accomplishmentReport = await getCurrentAccomplishmentReport(supabase, accomplishmentId);
	const accomplishmentHeader = await getAccomplishmentHeaders(supabase, accomplishmentId);

	//forms
	const accomplishmentHeaderForms = await getAccomplishmentHeaderForms();
	const accomplishmentAnnualPlanForms = await getAccomplishmentAnnualPlanForms();
	const accomplishmentActivityForms = await getAccomplishmentActivityForms();

	return {
		accomplishmentReport,
		accomplishmentHeader,
		form: {
			accomplishmentHeaderForms,
			accomplishmentAnnualPlanForms,
			accomplishmentActivityForms
		}
	};
}) satisfies PageServerLoad;

export const actions = {
	//accomplishment header
	createaccheader: async ({ request, locals: { supabase } }) => {
		return createAccomplishmentHeader(request, supabase);
	},
	updateaccheader: async ({ request, locals: { supabase } }) => {
		return updateAccomplishmentHeader(request, supabase);
	},
	deleteaccheader: async ({ request, locals: { supabase } }) => {
		return deleteAccomplishmentHeader(request, supabase);
	},
	//annual plan
	createannualplan: async ({ request, locals: { supabase } }) => {
		return createAccomplishmentAnnualPlan(request, supabase);
	},
	updateannualplan: async ({ request, locals: { supabase } }) => {
		return updateAccomplishmentAnnualPlan(request, supabase);
	},
	deleteannualplan: async ({ request, locals: { supabase } }) => {
		return deleteAccomplishmentAnnualPlan(request, supabase);
	},
	//activity
	createactivity: async ({ request, locals: { supabase } }) => {
		return createAccomplishmentActivity(request, supabase);
	},
	updateactivity: async ({ request, locals: { supabase } }) => {
		return updateAccomplishmentActivity(request, supabase);
	},
	deleteactivity: async ({ request, locals: { supabase } }) => {
		return deleteAccomplishmentActivity(request, supabase);
	}
} satisfies Actions;
