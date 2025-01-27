import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getStrategicPlanByOwnerId, getStrategicPlanForms } from './(data)/server_load_helper';
import {
	createStrategicPlan,
	deleteStrategicPlan,
	updateStrategicPlan
} from './(data)/strat_plan_services';

export const load = (async ({ locals: { session, supabase } }) => {
	const userId = session?.user.id;
	if (!userId) {
		error(401, 'Unauthorized');
	}
	//data
	const strategicPlans = await getStrategicPlanByOwnerId(userId, supabase);

	//forms
	const strategicPlanForms = await getStrategicPlanForms();
	return {
		strategicPlans,
		forms: {
			strategicPlanForms
		}
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createstrategicplan: async ({ request, locals: { supabase, session } }) => {
		if (!session) {
			error(401, 'Unauthorized');
		}
		return createStrategicPlan(request, supabase, session.user.id);
	},
	deletestrategicplan: async ({ request, locals: { supabase, session } }) => {
		return deleteStrategicPlan(request, supabase);
	},
	updatestrategicplan: async ({ request, locals: { supabase, session } }) => {
		return updateStrategicPlan(request, supabase);
	}
};
