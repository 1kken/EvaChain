import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const ACCOMPLISHMENT_REPORT_STATE_KEY = Symbol('ACCOMPLISHMENT_REPORT_STATE_KEY');

type AccomplishmentReportState = {
	currentUserAccomplishmentReport: Writable<Tables<'accomplishment_report'>[]>;
	addAccomplishmentReport: (report: Tables<'accomplishment_report'>) => void;
	updateAccomplishmentReport: (
		id: string,
		updates: Partial<Tables<'accomplishment_report'>>
	) => void;
	removeAccomplishmentReport: (id: string) => void;
};

function createAccomplishmentReportStore(
	initialData?: Tables<'accomplishment_report'>[]
): AccomplishmentReportState {
	const currentUserAccomplishmentReport = writable<Tables<'accomplishment_report'>[]>(
		initialData || []
	);

	function addAccomplishmentReport(report: Tables<'accomplishment_report'>) {
		currentUserAccomplishmentReport.update((reports) => [...reports, report]);
	}

	function updateAccomplishmentReport(
		id: string,
		updates: Partial<Tables<'accomplishment_report'>>
	) {
		currentUserAccomplishmentReport.update((reports) =>
			reports.map((report) => (report.id === id ? { ...report, ...updates } : report))
		);
	}

	function removeAccomplishmentReport(id: string) {
		currentUserAccomplishmentReport.update((reports) =>
			reports.filter((report) => report.id !== id)
		);
	}

	return {
		currentUserAccomplishmentReport,
		addAccomplishmentReport,
		updateAccomplishmentReport,
		removeAccomplishmentReport
	};
}

export function getAccomplishmentReportStore(): AccomplishmentReportState {
	const store = getContext<AccomplishmentReportState>(ACCOMPLISHMENT_REPORT_STATE_KEY);
	if (!store) {
		throw new Error('Accomplishment Report store not found in context');
	}
	return store;
}

export function setAccomplishmentReportStore(
	initialData?: Tables<'accomplishment_report'>[]
): AccomplishmentReportState {
	const store = createAccomplishmentReportStore(initialData);
	setContext(ACCOMPLISHMENT_REPORT_STATE_KEY, store);
	return store;
}

export type { AccomplishmentReportState };
