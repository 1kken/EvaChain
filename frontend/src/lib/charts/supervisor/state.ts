import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import type { Tables } from '$lib/types/database.types';

export interface PerformanceSummary {
	average: number;
	year: number;
	period: number;
}

export interface TeachingEffectivenessSummary {
	average: number;
	year: number;
	period: number;
}

// Create a symbol for the supervisor chart store context key
const SUPERVISOR_CHART_STORE_KEY = Symbol('SUPERVISOR_CHART_STORE_KEY');

// Define the shape of the supervisor chart store
interface SupervisorChartStore {
	performanceData: Writable<PerformanceSummary[] | null>;
	teachingEffectivenessData: Writable<TeachingEffectivenessSummary[] | null>;
}
// Create a function to initialize the supervisor chart store
function createSupervisorChartStore(): SupervisorChartStore {
	return {
		performanceData: writable<PerformanceSummary[] | null>(null),
		teachingEffectivenessData: writable<TeachingEffectivenessSummary[] | null>(null)
	};
}

// Function to get the supervisor chart store from context
export function getSupervisorChartStore(): SupervisorChartStore {
	const store = getContext<SupervisorChartStore>(SUPERVISOR_CHART_STORE_KEY);
	if (!store) {
		throw new Error('SupervisorChartStore not found in context');
	}
	return store;
}

// Function to set the supervisor chart store in context
export function setSupervisorChartStore(): SupervisorChartStore {
	const store = createSupervisorChartStore();
	setContext(SUPERVISOR_CHART_STORE_KEY, store);
	return store;
}

export type { SupervisorChartStore };
