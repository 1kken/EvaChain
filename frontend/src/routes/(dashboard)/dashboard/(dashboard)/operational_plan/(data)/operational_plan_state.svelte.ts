import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const OPERATIONAL_PLAN_STATE_KEY = Symbol('OPERATIONAL_PLAN_STATE_KEY');

type OperationalPlanState = {
	currentOperationalPlans: Writable<Tables<'operational_plan'>[]>;
	addOperationalPlan: (operationalPlan: Tables<'operational_plan'>) => void;
	updateOperationalPlan: (id: string, updates: Partial<Tables<'operational_plan'>>) => void;
	removeOperationalPlan: (id: string) => void;
};

function createOperationalPlanStore(
	initialData?: Tables<'operational_plan'>[]
): OperationalPlanState {
	const currentOperationalPlans = writable<Tables<'operational_plan'>[]>(initialData || []);

	function addOperationalPlan(operationalPlan: Tables<'operational_plan'>) {
		currentOperationalPlans.update((plans) => [...plans, operationalPlan]);
	}

	function updateOperationalPlan(id: string, updates: Partial<Tables<'operational_plan'>>) {
		currentOperationalPlans.update((plans) =>
			plans.map((plan) => (plan.id === id ? { ...plan, ...updates } : plan))
		);
	}

	function removeOperationalPlan(id: string) {
		currentOperationalPlans.update((plans) => plans.filter((plan) => plan.id !== id));
	}

	return {
		currentOperationalPlans,
		addOperationalPlan,
		updateOperationalPlan,
		removeOperationalPlan
	};
}

export function getOperationalPlansStore(): OperationalPlanState {
	const store = getContext<OperationalPlanState>(OPERATIONAL_PLAN_STATE_KEY);
	if (!store) {
		throw new Error('Operational Plan store not found in context');
	}
	return store;
}

export function setOperationalPlanStore(
	initialData?: Tables<'operational_plan'>[]
): OperationalPlanState {
	const store = createOperationalPlanStore(initialData);
	setContext(OPERATIONAL_PLAN_STATE_KEY, store);
	return store;
}

export type { OperationalPlanState };
