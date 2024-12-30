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
	canEdit: Writable<boolean>;
	isDraft: Writable<boolean>;
	isSubmitted: Writable<boolean>;
	isReviewing: Writable<boolean>;
	isRevision: Writable<boolean>;
	isApproved: Writable<boolean>;
	isUsingTemplate: Writable<boolean>;
};

function createAccomplishmentReportStore(
	initialData?: Tables<'accomplishment_report'> | null
): AccomplishmentReportState {
	const currentAccomplishmentReport = writable<Tables<'accomplishment_report'> | null>(
		initialData || null
	);

	// Initialize status stores with initial state
	const canEdit = writable<boolean>(
		initialData?.status === 'draft' || initialData?.status === 'revision' || false
	);
	const isDraft = writable<boolean>(initialData?.status === 'draft' || false);
	const isSubmitted = writable<boolean>(initialData?.status === 'submitted' || false);
	const isReviewing = writable<boolean>(initialData?.status === 'reviewing' || false);
	const isRevision = writable<boolean>(initialData?.status === 'revision' || false);
	const isApproved = writable<boolean>(initialData?.status === 'approved' || false);
	const isUsingTemplate = writable<boolean>(initialData?.using_template || false);

	function setAccomplishmentReport(report: Tables<'accomplishment_report'>) {
		currentAccomplishmentReport.set(report);
		// Update all status stores
		canEdit.set(report.status === 'draft' || report.status === 'revision');
		isDraft.set(report.status === 'draft');
		isSubmitted.set(report.status === 'submitted');
		isReviewing.set(report.status === 'reviewing');
		isRevision.set(report.status === 'revision');
		isApproved.set(report.status === 'approved');
		isUsingTemplate.set(report.using_template);
	}

	function updateAccomplishmentReport(updates: Partial<Tables<'accomplishment_report'>>) {
		currentAccomplishmentReport.update((report) => {
			if (!report) return null;
			const updatedReport = { ...report, ...updates };

			// Update status stores if status changes
			if (updates.status) {
				canEdit.set(updates.status === 'draft' || updates.status === 'revision');
				isDraft.set(updates.status === 'draft');
				isSubmitted.set(updates.status === 'submitted');
				isReviewing.set(updates.status === 'reviewing');
				isRevision.set(updates.status === 'revision');
				isApproved.set(updates.status === 'approved');
			}

			if ('using_template' in updates) {
				isUsingTemplate.set(!!updates.using_template);
			}

			return updatedReport;
		});
	}

	function clearAccomplishmentReport() {
		currentAccomplishmentReport.set(null);
		canEdit.set(false);
		isDraft.set(false);
		isSubmitted.set(false);
		isReviewing.set(false);
		isRevision.set(false);
		isApproved.set(false);
		isUsingTemplate.set(false);
	}

	return {
		currentAccomplishmentReport,
		updateAccomplishmentReport,
		setAccomplishmentReport,
		clearAccomplishmentReport,
		canEdit,
		isDraft,
		isSubmitted,
		isReviewing,
		isRevision,
		isApproved,
		isUsingTemplate
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
