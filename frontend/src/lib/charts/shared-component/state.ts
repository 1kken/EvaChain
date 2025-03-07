import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

// Define the types as specified
export interface PopulationData {
	titleName: string;
	population: number;
	malePopulation: number;
	femalePopulation: number;
}

export type EmployeeStatusData = {
	[statusType: string]: number;
};

export type NatureOfWorkData = {
	[natureOfWork: string]: number;
};

export type AcademicRanksData = {
	academicRanks: { label: string; count: number; color: string }[];
	breakdownAcademicRanks: Record<
		string,
		{
			color: string;
			items: { label: string; count: number }[];
		}
	>;
};

// Create a symbol for the chart data context key
const SHARED_CHART_STORE_KEY = Symbol('SHARED_CHART_STORE_KEY');

// Define the shape of our shared chart store
interface SharedChartStore {
	populationData: Writable<PopulationData | null>;
	employeeStatusData: Writable<EmployeeStatusData>;
	academicRanksData: Writable<AcademicRanksData>;
	totalBudgetRequirementData: Writable<Tables<'operational_plan_budget_summary'> | null>;
	natureOfWorkData: Writable<NatureOfWorkData>;
	// Add more chart data states as needed
}

// Create a function to initialize the chart state
function createSharedChartStore(): SharedChartStore {
	return {
		populationData: writable<PopulationData>(),
		employeeStatusData: writable<EmployeeStatusData>({}),
		academicRanksData: writable<AcademicRanksData>(),
		totalBudgetRequirementData: writable<Tables<'operational_plan_budget_summary'> | null>(null),
		natureOfWorkData: writable<NatureOfWorkData>({})
	};
}

// Function to get the chart store from context
export function getSharedChartStore(): SharedChartStore {
	const store = getContext<SharedChartStore>(SHARED_CHART_STORE_KEY);
	if (!store) {
		throw new Error('SharedChartStore not found in context');
	}
	return store;
}

// Function to set the chart store in context
export function setSharedChartStore(): SharedChartStore {
	const store = createSharedChartStore();
	setContext(SHARED_CHART_STORE_KEY, store);
	return store;
}

export type { SharedChartStore };
