import type { Actions, PageServerLoad } from './$types';
import {
	createStrategyPlan,
	deleteStrategyPlan,
	updateStrategyPlan
} from './services/strategy_plan_services';
import {
	fetchStrategicPlan,
	fetchStrategyPerformanceIndicatorForms,
	fetchStrategyPlan,
	fetchStrategyPlanForms
} from './utils/page_server_load';

export const load = (async ({ params, locals: { supabase, session } }) => {
	const stratId = params.stratid;

	//data
	const strategicPlan = await fetchStrategicPlan(stratId, supabase);
	const strategyPlans = await fetchStrategyPlan(stratId, supabase);

	//form
	const strategyPlanForm = await fetchStrategyPlanForms();
	const strategyPlanPerfIndicatorForm = await fetchStrategyPerformanceIndicatorForms();

	return {
		strategicPlan,
		strategyPlans,
		forms: {
			strategyPlanForm,
			strategyPlanPerfIndicatorForm
		}
	};
}) satisfies PageServerLoad;

export const actions = {
	createstrategyplan: async ({ request, locals: { supabase, session } }) => {
		return createStrategyPlan(request, supabase);
	},
	updatestrategyplan: async ({ request, locals: { supabase, session } }) => {
		return updateStrategyPlan(request, supabase);
	},
	deleteStrategyPlan: async ({ request, locals: { supabase, session } }) => {
		return deleteStrategyPlan(request, supabase);
	}
} satisfies Actions;
