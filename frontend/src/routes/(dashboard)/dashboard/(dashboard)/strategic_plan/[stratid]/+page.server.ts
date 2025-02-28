import type { Actions, PageServerLoad } from './$types';
import {
	createPerformanceIndicator,
	deleteIndicator,
	updatePerformanceIndicator
} from './services/performance_indicator_services';
import { publishStratPlan } from './services/publish_strat_plan';
import {
	createStrategyPlan,
	deleteStrategyPlan,
	updateStrategyPlan
} from './services/strategy_plan_services';
import {
	fetchPublishStratPlanForm,
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
	const publishStratPlanSchema = await fetchPublishStratPlanForm();

	return {
		strategicPlan,
		strategyPlans,
		forms: {
			publishStratPlanSchema,
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
	deletestrategyplan: async ({ request, locals: { supabase, session } }) => {
		return deleteStrategyPlan(request, supabase);
	},
	//indicators
	createindicator: async ({ request, locals: { supabase, session } }) => {
		return createPerformanceIndicator(request, supabase);
	},
	updateindicator: async ({ request, locals: { supabase, session } }) => {
		return updatePerformanceIndicator(request, supabase);
	},
	deleteindicator: async ({ request, locals: { supabase, session } }) => {
		return deleteIndicator(request, supabase);
	},
	//publish indicator
	publishstratplan: async ({ request, locals: { supabase, session } }) => {
		return publishStratPlan(request, supabase);
	}
} satisfies Actions;
