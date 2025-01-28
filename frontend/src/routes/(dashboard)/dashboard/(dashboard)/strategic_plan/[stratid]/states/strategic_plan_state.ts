import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { derived, writable, type Writable, type Readable } from 'svelte/store';

const STRATEGIC_PLAN_STATE_KEY = Symbol('STRATEGIC_PLAN_STATE_KEY');

type StrategicPlanState = {
	currentStrategicPlan: Writable<Tables<'strategic_plan'> | null>;
	setCurrentStrategicPlan: (plan: Tables<'strategic_plan'>) => void;
	resetCurrentStrategicPlan: () => void;
	yearCount: Readable<number | null>;
};

function createStrategicPlanStore(initialData?: Tables<'strategic_plan'>): StrategicPlanState {
	const currentStrategicPlan = writable<Tables<'strategic_plan'> | null>(initialData || null);

	function setCurrentStrategicPlan(plan: Tables<'strategic_plan'>) {
		currentStrategicPlan.set(plan);
	}

	function resetCurrentStrategicPlan() {
		currentStrategicPlan.set(null);
	}

	const yearCount = derived(currentStrategicPlan, ($plan) => {
		if (!$plan) return null;
		return $plan.end_year - $plan.start_year + 1;
	});

	return {
		currentStrategicPlan,
		setCurrentStrategicPlan,
		resetCurrentStrategicPlan,
		yearCount
	};
}

export function getCurrentStrategicPlanStore(): StrategicPlanState {
	const store = getContext<StrategicPlanState>(STRATEGIC_PLAN_STATE_KEY);
	if (!store) {
		throw new Error('Strategic Plan store not found in context');
	}
	return store;
}

export function setCurrentStrategicPlanStore(
	initialData?: Tables<'strategic_plan'>
): StrategicPlanState {
	const store = createStrategicPlanStore(initialData);
	setContext(STRATEGIC_PLAN_STATE_KEY, store);
	return store;
}

export type { StrategicPlanState };
