import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const DASHBOARD_CONTROLS_KEY = Symbol('DASHBOARD_CONTROLS_KEY');

type DashboardControlsState = {
	IREGMYear: Writable<string>;
	// Add more dashboard control states as needed
};

function createDashboardControlsStore(): DashboardControlsState {
	// Set default year to current year
	const currentYear = new Date().getFullYear().toString();

	return {
		IREGMYear: writable<string>(currentYear)
		// Initialize other dashboard controls here
	};
}

export function getDashboardControlsStore(): DashboardControlsState {
	const store = getContext<DashboardControlsState>(DASHBOARD_CONTROLS_KEY);
	if (!store) {
		throw new Error('Dashboard controls store not found in context');
	}
	return store;
}

export function setDashboardControlsStore(): DashboardControlsState {
	const store = createDashboardControlsStore();
	setContext(DASHBOARD_CONTROLS_KEY, store);
	return store;
}

export type { DashboardControlsState };
