import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const ACCOMPLISHMENT_ANNUAL_PLAN_STATE_KEY = Symbol('ACCOMPLISHMENT_ANNUAL_PLAN_STATE_KEY');

type AccomplishmentAnnualPlanState = {
	currentAccomplishmentAnnualPlans: Writable<Tables<'accomplishment_annual_plan'>[]>;
	size: Writable<number>;
	addAccomplishmentAnnualPlan: (
		accomplishmentAnnualPlan: Tables<'accomplishment_annual_plan'>
	) => void;
	updateAccomplishmentAnnualPlan: (
		id: string,
		updates: Partial<Tables<'accomplishment_annual_plan'>>
	) => void;
	removeAccomplishmentAnnualPlan: (id: string) => void;
};

function createAccomplishmentAnnualPlanStore(
	initialData?: Tables<'accomplishment_annual_plan'>[]
): AccomplishmentAnnualPlanState {
	const currentAccomplishmentAnnualPlans = writable<Tables<'accomplishment_annual_plan'>[]>(
		initialData || []
	);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentAccomplishmentAnnualPlans changes
	currentAccomplishmentAnnualPlans.subscribe((plans) => {
		size.set(plans.length);
	});

	function addAccomplishmentAnnualPlan(
		accomplishmentAnnualPlan: Tables<'accomplishment_annual_plan'>
	) {
		currentAccomplishmentAnnualPlans.update((plans) => [...plans, accomplishmentAnnualPlan]);
	}

	function updateAccomplishmentAnnualPlan(
		id: string,
		updates: Partial<Tables<'accomplishment_annual_plan'>>
	) {
		currentAccomplishmentAnnualPlans.update((plans) =>
			plans.map((plan) => (plan.id === id ? { ...plan, ...updates } : plan))
		);
	}

	function removeAccomplishmentAnnualPlan(id: string) {
		currentAccomplishmentAnnualPlans.update((plans) => plans.filter((plan) => plan.id !== id));
	}

	return {
		currentAccomplishmentAnnualPlans,
		size,
		addAccomplishmentAnnualPlan,
		updateAccomplishmentAnnualPlan,
		removeAccomplishmentAnnualPlan
	};
}

export function getAccomplishmentAnnualPlanStore(): AccomplishmentAnnualPlanState {
	const store = getContext<AccomplishmentAnnualPlanState>(ACCOMPLISHMENT_ANNUAL_PLAN_STATE_KEY);
	if (!store) {
		throw new Error('Accomplishment Annual Plan store not found in context');
	}
	return store;
}

export function setAccomplishmentAnnualPlanStore(
	initialData?: Tables<'accomplishment_annual_plan'>[]
): AccomplishmentAnnualPlanState {
	const store = createAccomplishmentAnnualPlanStore(initialData);
	setContext(ACCOMPLISHMENT_ANNUAL_PLAN_STATE_KEY, store);
	return store;
}

export type { AccomplishmentAnnualPlanState };
