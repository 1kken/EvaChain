import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const STRATEGIC_PLAN_STATE_KEY = Symbol('STRATEGIC_PLAN_STATE_KEY');

const ALL_MAJOR_OUTPUTS = [
	'instruction',
	'research',
	'extension',
	'governance_and_management'
] as const;

type MajorOutput = (typeof ALL_MAJOR_OUTPUTS)[number];

type StrategicPlanState = {
	currentPlans: Writable<Tables<'strategic_plan'>[]>;
	addPlan: (plan: Tables<'strategic_plan'>) => void;
	updatePlan: (id: string, updates: Partial<Tables<'strategic_plan'>>) => void;
	removePlan: (id: string) => void;
	isOutputAvailable: (output: MajorOutput, year: number) => boolean;
};

function createStrategicPlanStore(initialData?: Tables<'strategic_plan'>[]): StrategicPlanState {
	const currentPlans = writable<Tables<'strategic_plan'>[]>(initialData || []);

	function addPlan(plan: Tables<'strategic_plan'>) {
		currentPlans.update((plans) => [...plans, plan]);
	}

	function updatePlan(id: string, updates: Partial<Tables<'strategic_plan'>>) {
		currentPlans.update((plans) =>
			plans.map((plan) => (plan.id === id ? { ...plan, ...updates } : plan))
		);
	}

	function removePlan(id: string) {
		currentPlans.update((plans) => plans.filter((plan) => plan.id !== id));
	}

	function isOutputAvailable(output: MajorOutput, year: number): boolean {
		let plans: Tables<'strategic_plan'>[] = [];
		currentPlans.subscribe((value) => {
			plans = value;
		})();

		return !plans.some((plan) => {
			const planYear = new Date(plan.created_at).getFullYear();
			return planYear === year && plan.major_output === output;
		});
	}

	return {
		currentPlans,
		addPlan,
		updatePlan,
		removePlan,
		isOutputAvailable
	};
}

export function getStrategicPlanStore(): StrategicPlanState {
	const store = getContext<StrategicPlanState>(STRATEGIC_PLAN_STATE_KEY);
	if (!store) {
		throw new Error('Strategic Plan store not found in context');
	}
	return store;
}

export function setStrategicPlanStore(
	initialData?: Tables<'strategic_plan'>[]
): StrategicPlanState {
	const store = createStrategicPlanStore(initialData);
	setContext(STRATEGIC_PLAN_STATE_KEY, store);
	return store;
}

export type { StrategicPlanState, MajorOutput };
export { ALL_MAJOR_OUTPUTS };
