import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export interface OfficeTeachingEffectiveness {
	office_code: string;
	office_teaching_effectiveness_avg: number;
}
// Create a symbol for the heads chart data context key
const HEADS_CHART_STORE_KEY = Symbol('HEADS_CHART_STORE_KEY');

// Define the shape of our heads chart store
interface HeadsChartStore {
	currentAcademicOffice: Writable<string | null>;
	academicOffices: Writable<Tables<'office'>[] | null>;
	teachingEffectivenessByOffice: Writable<OfficeTeachingEffectiveness[] | null>;
}

// Create a function to initialize the heads chart state
function createHeadsChartStore(): HeadsChartStore {
	return {
		currentAcademicOffice: writable<string | null>(null),
		academicOffices: writable<Tables<'office'>[] | null>(null),
		teachingEffectivenessByOffice: writable<OfficeTeachingEffectiveness[] | null>(null)
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
