import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const ACCOMPLISHMENT_REPORT_STATE_KEY = Symbol('ACCOMPLISHMENT_REPORT_STATE_KEY');

type AccomplishmentReportStatus = 'draft' | 'submitted' | 'reviewing' | 'revision' | 'approved';

type AccomplishmentReportState = {
	currentAccomplishmentReport: Writable<Tables<'accomplishment_report'> | null>;
	updateAccomplishmentReport: (updates: Partial<Tables<'accomplishment_report'>>) => void;
	setAccomplishmentReport: (report: Tables<'accomplishment_report'>) => void;
	clearAccomplishmentReport: () => void;
};

function createAccomplishmentReportStore(
	initialData?: Tables<'accomplishment_report'> | null
): AccomplishmentReportState {
	const currentAccomplishmentReport = writable<Tables<'accomplishment_report'> | null>(
		initialData || null
	);

	// Initialize status stores with initial state
	function setAccomplishmentReport(report: Tables<'accomplishment_report'>) {
		currentAccomplishmentReport.set(report);
		// Update all status stores
	}

	function updateAccomplishmentReport(updates: Partial<Tables<'accomplishment_report'>>) {
		currentAccomplishmentReport.update((report) => {
			if (!report) return null;
			const updatedReport = { ...report, ...updates };

			return updatedReport;
		});
	}

	function clearAccomplishmentReport() {
		currentAccomplishmentReport.set(null);
	}

	return {
		currentAccomplishmentReport,
		updateAccomplishmentReport,
		setAccomplishmentReport,
		clearAccomplishmentReport
	};
}

export function getCurrentAccomplishmentReportStore(): AccomplishmentReportState {
	const store = getContext<AccomplishmentReportState>(ACCOMPLISHMENT_REPORT_STATE_KEY);
	if (!store) {
		throw new Error('Accomplishment Report store not found in context');
	}
	return store;
}

export function setCurrentAccomplishmentReportStore(
	initialData?: Tables<'accomplishment_report'> | null
): AccomplishmentReportState {
	const store = createAccomplishmentReportStore(initialData);
	setContext(ACCOMPLISHMENT_REPORT_STATE_KEY, store);
	return store;
}

export type { AccomplishmentReportState, AccomplishmentReportStatus };
