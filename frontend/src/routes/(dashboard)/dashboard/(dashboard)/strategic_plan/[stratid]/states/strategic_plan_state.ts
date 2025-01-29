import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { derived, writable, type Writable, type Readable } from 'svelte/store';

const STRATEGIC_PLAN_STATE_KEY = Symbol('STRATEGIC_PLAN_STATE_KEY');

interface StrategicWithObjectives {
	strategic: Tables<'strategic_plan'>;
	objectives: Tables<'strat_plan_objective'>[];
}

type StrategicPlanState = {
	currentStrategicPlan: Writable<StrategicWithObjectives | null>;
	setCurrentStrategicPlan: (plan: StrategicWithObjectives) => void;
	resetCurrentStrategicPlan: () => void;
	yearCount: Readable<number | null>;
	objectives: Readable<Tables<'strat_plan_objective'>[]>;
};

function createStrategicPlanStore(initialData?: StrategicWithObjectives): StrategicPlanState {
	const currentStrategicPlan = writable<StrategicWithObjectives | null>(initialData || null);

	function setCurrentStrategicPlan(plan: StrategicWithObjectives) {
		currentStrategicPlan.set(plan);
	}

	function resetCurrentStrategicPlan() {
		currentStrategicPlan.set(null);
	}

	const yearCount = derived(currentStrategicPlan, ($plan) => {
		if (!$plan) return null;
		return $plan.strategic.end_year - $plan.strategic.start_year + 1;
	});

	const objectives = derived(currentStrategicPlan, ($plan) => {
		if (!$plan) return [];
		return $plan.objectives;
	});

	return {
		currentStrategicPlan,
		setCurrentStrategicPlan,
		resetCurrentStrategicPlan,
		yearCount,
		objectives
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
	initialData?: StrategicWithObjectives
): StrategicPlanState {
	const store = createStrategicPlanStore(initialData);
	setContext(STRATEGIC_PLAN_STATE_KEY, store);
	return store;
}

export type { StrategicPlanState, StrategicWithObjectives };
