import type { Actions, PageServerLoad } from './$types';
import { createOpHeader, deleteOpHeader, updateOpHeader } from './services/op_header_services';
import {
	getOpActivityForms,
	getOpAnnualPlanForms,
	getOperationalPlan,
	getOpHeaderForms,
	getOpHeaders,
	getOpIndicatorForms,
	getOpSubmitForm
} from './utils/load_services';
import {
	createOpActivity,
	deleteOpActivity,
	updateOpActivity
} from './services/op_activity_services';
import {
	createOpAnnualPlan,
	deleteOpAnnualPlan,
	updateOpAnnualPlan
} from './services/op_annual_plan_services';
import {
	createOpIndicator,
	deleteOpIndicator,
	updateOpIndicator
} from './services/op_indicator_services';
import { submitOperationalPlan } from './services/op_submit_services';

export const load = (async ({ params, locals: { supabase, session } }) => {
	const { opid } = params;
	const operationalPlan = await getOperationalPlan(opid, supabase);
	const opHeaders = await getOpHeaders(opid, supabase);
	const opHeaderForms = await getOpHeaderForms();
	const opAnnualPlanForms = await getOpAnnualPlanForms();
	const opActivityForms = await getOpActivityForms();
	const opIndicatorForms = await getOpIndicatorForms();
	const submitOpForm = await getOpSubmitForm();

	return {
		operationalPlan,
		opHeaders,
		opHeaderForms,
		opAnnualPlanForms,
		opActivityForms,
		opIndicatorForms,
		submitOpForm
	};
}) satisfies PageServerLoad;

export const actions = {
	//op header
	createopheader: async ({ request, locals: { supabase, session } }) => {
		return createOpHeader(request, supabase);
	},
	//op header
	deleteopheader: async ({ request, locals: { supabase, session } }) => {
		return deleteOpHeader(request, supabase);
	},
	updateopheader: async ({ request, locals: { supabase, session } }) => {
		return updateOpHeader(request, supabase);
	},
	//op annual plan
	createopannualplan: async ({ request, locals: { supabase, session } }) => {
		return createOpAnnualPlan(request, supabase);
	},
	deleteopannualplan: async ({ request, locals: { supabase, session } }) => {
		return deleteOpAnnualPlan(request, supabase);
	},
	updateopannualplan: async ({ request, locals: { supabase, session } }) => {
		return updateOpAnnualPlan(request, supabase);
	},
	//activities
	createopactivity: async ({ request, locals: { supabase, session } }) => {
		return createOpActivity(request, supabase);
	},
	updateopactivity: async ({ request, locals: { supabase, session } }) => {
		return updateOpActivity(request, supabase);
	},
	deleteopactivity: async ({ request, locals: { supabase, session } }) => {
		return deleteOpActivity(request, supabase);
	},
	//indicator
	createopindicator: async ({ request, locals: { supabase, session } }) => {
		return createOpIndicator(request, supabase);
	},
	updateopindicator: async ({ request, locals: { supabase, session } }) => {
		return updateOpIndicator(request, supabase);
	},
	deleteopindicator: async ({ request, locals: { supabase, session } }) => {
		return deleteOpIndicator(request, supabase);
	},
	submitop: async ({ request, locals: { supabase } }) => {
		return submitOperationalPlan(request, supabase);
	}
} satisfies Actions;
