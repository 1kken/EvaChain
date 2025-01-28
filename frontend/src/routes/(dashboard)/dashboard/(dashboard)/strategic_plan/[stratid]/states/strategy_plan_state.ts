import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const STRATEGY_PLAN_STATE_KEY = Symbol('STRATEGY_PLAN_STATE_KEY');

type StrategyPlanState = {
	currentStrategyPlans: Writable<Tables<'strategy_plan'>[]>;
	size: Writable<number>;
	addStrategyPlan: (strategyPlan: Tables<'strategy_plan'>) => void;
	updateStrategyPlan: (id: string, updates: Partial<Tables<'strategy_plan'>>) => void;
	removeStrategyPlan: (id: string) => void;
	getStrategyPlansByStratPlanId: (stratPlanId: string) => Tables<'strategy_plan'>[];
};

function createStrategyPlanStore(initialData?: Tables<'strategy_plan'>[]): StrategyPlanState {
	const currentStrategyPlans = writable<Tables<'strategy_plan'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	currentStrategyPlans.subscribe((plans) => {
		size.set(plans.length);
	});

	function addStrategyPlan(strategyPlan: Tables<'strategy_plan'>) {
		currentStrategyPlans.update((plans) => [...plans, strategyPlan]);
	}

	function updateStrategyPlan(id: string, updates: Partial<Tables<'strategy_plan'>>) {
		currentStrategyPlans.update((plans) =>
			plans.map((plan) => (plan.id === id ? { ...plan, ...updates } : plan))
		);
	}

	function removeStrategyPlan(id: string) {
		currentStrategyPlans.update((plans) => plans.filter((plan) => plan.id !== id));
	}

	function getStrategyPlansByStratPlanId(stratPlanId: string): Tables<'strategy_plan'>[] {
		let plans: Tables<'strategy_plan'>[] = [];
		currentStrategyPlans.subscribe((allPlans) => {
			plans = allPlans.filter((plan) => plan.strat_plan_id === stratPlanId);
		})();
		return plans;
	}

	return {
		currentStrategyPlans,
		size,
		addStrategyPlan,
		updateStrategyPlan,
		removeStrategyPlan,
		getStrategyPlansByStratPlanId
	};
}

export function getStrategyPlanStore(): StrategyPlanState {
	const store = getContext<StrategyPlanState>(STRATEGY_PLAN_STATE_KEY);
	if (!store) {
		throw new Error('Strategy Plan store not found in context');
	}
	return store;
}

export function setStrategyPlanStore(initialData?: Tables<'strategy_plan'>[]): StrategyPlanState {
	const store = createStrategyPlanStore(initialData);
	setContext(STRATEGY_PLAN_STATE_KEY, store);
	return store;
}

export type { StrategyPlanState };
