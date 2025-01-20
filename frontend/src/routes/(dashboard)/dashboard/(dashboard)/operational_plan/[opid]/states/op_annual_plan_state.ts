import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const OP_ANNUAL_PLAN_STATE_KEY = Symbol('OP_ANNUAL_PLAN_STATE_KEY');

type OpAnnualPlanState = {
	currentOpAnnualPlans: Writable<Tables<'op_annual_plan'>[]>;
	size: Writable<number>;
	addOpAnnualPlan: (opAnnualPlan: Tables<'op_annual_plan'>) => void;
	updateOpAnnualPlan: (id: string, updates: Partial<Tables<'op_annual_plan'>>) => void;
	removeOpAnnualPlan: (id: string) => void;
};

function createOpAnnualPlanStore(initialData?: Tables<'op_annual_plan'>[]): OpAnnualPlanState {
	const currentOpAnnualPlans = writable<Tables<'op_annual_plan'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentOpAnnualPlans changes
	currentOpAnnualPlans.subscribe((plans) => {
		size.set(plans.length);
	});

	function addOpAnnualPlan(opAnnualPlan: Tables<'op_annual_plan'>) {
		currentOpAnnualPlans.update((plans) => [...plans, opAnnualPlan]);
	}

	function updateOpAnnualPlan(id: string, updates: Partial<Tables<'op_annual_plan'>>) {
		currentOpAnnualPlans.update((plans) =>
			plans.map((plan) => (plan.id === id ? { ...plan, ...updates } : plan))
		);
	}

	function removeOpAnnualPlan(id: string) {
		currentOpAnnualPlans.update((plans) => plans.filter((plan) => plan.id !== id));
	}

	return {
		currentOpAnnualPlans,
		size,
		addOpAnnualPlan,
		updateOpAnnualPlan,
		removeOpAnnualPlan
	};
}

export function getOpAnnualPlanStore(): OpAnnualPlanState {
	const store = getContext<OpAnnualPlanState>(OP_ANNUAL_PLAN_STATE_KEY);
	if (!store) {
		throw new Error('Op Annual Plan store not found in context');
	}
	return store;
}

export function setOpAnnualPlanStore(initialData?: Tables<'op_annual_plan'>[]): OpAnnualPlanState {
	const store = createOpAnnualPlanStore(initialData);
	setContext(OP_ANNUAL_PLAN_STATE_KEY, store);
	return store;
}

export type { OpAnnualPlanState };
