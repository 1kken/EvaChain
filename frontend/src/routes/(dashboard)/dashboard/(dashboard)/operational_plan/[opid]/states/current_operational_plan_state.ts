import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const OPERATIONAL_PLAN_STATE_KEY = Symbol('OPERATIONAL_PLAN_STATE_KEY');

type OperationalPlanState = {
	currentOperationalPlan: Writable<Tables<'operational_plan'> | null>;
	setOperationalPlan: (plan: Tables<'operational_plan'>) => void;
	updateOperationalPlan: (updates: Partial<Tables<'operational_plan'>>) => void;
	resetOperationalPlan: () => void;
};

function createOperationalPlanStore(
	initialData?: Tables<'operational_plan'>
): OperationalPlanState {
	const currentOperationalPlan = writable<Tables<'operational_plan'> | null>(initialData || null);

	function setOperationalPlan(plan: Tables<'operational_plan'>) {
		currentOperationalPlan.set(plan);
	}

	function updateOperationalPlan(updates: Partial<Tables<'operational_plan'>>) {
		currentOperationalPlan.update((currentPlan) => {
			if (!currentPlan) return null;
			return {
				...currentPlan,
				...updates,
				updated_at: new Date().toISOString()
			};
		});
	}

	function resetOperationalPlan() {
		currentOperationalPlan.set(null);
	}

	return {
		currentOperationalPlan,
		setOperationalPlan,
		updateOperationalPlan,
		resetOperationalPlan
	};
}

export function getOperationalPlanStore(): OperationalPlanState {
	const store = getContext<OperationalPlanState>(OPERATIONAL_PLAN_STATE_KEY);
	if (!store) {
		throw new Error('Operational Plan store not found in context');
	}
	return store;
}

export function setOperationalPlanStore(
	initialData?: Tables<'operational_plan'>
): OperationalPlanState {
	const store = createOperationalPlanStore(initialData);
	setContext(OPERATIONAL_PLAN_STATE_KEY, store);
	return store;
}

export type { OperationalPlanState };
