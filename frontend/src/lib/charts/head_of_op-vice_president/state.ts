import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export interface OfficeTeachingEffectiveness {
	office_code: string;
	office_teaching_effectiveness_avg: number;
}

// Define the type for the returned data
export type OfficePerformanceData = {
	office_id: number;
	office_code: string;
	office_name: string;
	average_performance: number;
};
// Create a symbol for the heads chart data context key
const HEADS_CHART_STORE_KEY = Symbol('HEADS_CHART_STORE_KEY');

// Define the shape of our heads chart store
interface HeadsChartStore {
	currentAcademicOffice: Writable<string | null>;
	currentNonAcademicOffice: Writable<string | null>;
	academicOffices: Writable<Tables<'office'>[] | null>;
	nonAcademicOffices: Writable<Tables<'office'>[] | null>;
	teachingEffectivenessByOffice: Writable<OfficeTeachingEffectiveness[] | null>;
	techAdminPerformance: Writable<OfficePerformanceData[] | null>;
}

// Create a function to initialize the heads chart state
function createHeadsChartStore(): HeadsChartStore {
	return {
		currentNonAcademicOffice: writable<string | null>(null),
		currentAcademicOffice: writable<string | null>(null),
		academicOffices: writable<Tables<'office'>[] | null>(null),
		nonAcademicOffices: writable<Tables<'office'>[] | null>(null),
		teachingEffectivenessByOffice: writable<OfficeTeachingEffectiveness[] | null>(null),
		techAdminPerformance: writable<OfficePerformanceData[] | null>(null)
	};
}

// Function to get the heads chart store from context
export function getHeadsChartStore(): HeadsChartStore {
	const store = getContext<HeadsChartStore>(HEADS_CHART_STORE_KEY);
	if (!store) {
		throw new Error('HeadsChartStore not found in context');
	}
	return store;
}

// Function to set the heads chart store in context
export function setHeadsChartStore(): HeadsChartStore {
	const store = createHeadsChartStore();
	setContext(HEADS_CHART_STORE_KEY, store);
	return store;
}

export type { HeadsChartStore };
