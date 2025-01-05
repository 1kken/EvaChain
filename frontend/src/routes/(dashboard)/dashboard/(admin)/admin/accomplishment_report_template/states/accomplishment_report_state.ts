import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const ACCOMPLISHMENT_REPORT_TEMPLATE_STATE_KEY = Symbol('ACCOMPLISHMENT_REPORT_TEMPLATE_STATE_KEY');

type AccomplishmentReportTemplateState = {
	currentAccomplishmentReportTemplate: Writable<Tables<'accomplishment_report_template'> | null>;
	updateAccomplishmentReportTemplate: (
		updates: Partial<Tables<'accomplishment_report_template'>>
	) => void;
	setAccomplishmentReportTemplate: (report: Tables<'accomplishment_report_template'>) => void;
	clearAccomplishmentReportTemplate: () => void;
	canEdit: Writable<boolean>;
};

function createAccomplishmentReportTemplateStore(
	initialData?: Tables<'accomplishment_report_template'> | null
): AccomplishmentReportTemplateState {
	const currentAccomplishmentReportTemplate =
		writable<Tables<'accomplishment_report_template'> | null>(initialData || null);

	// Initialize canEdit based on is_published status
	const canEdit = writable<boolean>(!initialData?.is_published);

	function setAccomplishmentReportTemplate(report: Tables<'accomplishment_report_template'>) {
		currentAccomplishmentReportTemplate.set(report);
		canEdit.set(!report.is_published);
	}

	function updateAccomplishmentReportTemplate(
		updates: Partial<Tables<'accomplishment_report_template'>>
	) {
		currentAccomplishmentReportTemplate.update((report) => {
			if (!report) return null;
			const updatedReport = { ...report, ...updates };

			if ('is_published' in updates) {
				canEdit.set(!updates.is_published);
			}

			return updatedReport;
		});
	}

	function clearAccomplishmentReportTemplate() {
		currentAccomplishmentReportTemplate.set(null);
		canEdit.set(true);
	}

	return {
		currentAccomplishmentReportTemplate,
		updateAccomplishmentReportTemplate,
		setAccomplishmentReportTemplate,
		clearAccomplishmentReportTemplate,
		canEdit
	};
}

export function getCurrentAccomplishmentReportTemplateStore(): AccomplishmentReportTemplateState {
	const store = getContext<AccomplishmentReportTemplateState>(
		ACCOMPLISHMENT_REPORT_TEMPLATE_STATE_KEY
	);
	if (!store) {
		throw new Error('Accomplishment Report Template store not found in context');
	}
	return store;
}

export function setCurrentAccomplishmentReportTemplateStore(
	initialData?: Tables<'accomplishment_report_template'> | null
): AccomplishmentReportTemplateState {
	const store = createAccomplishmentReportTemplateStore(initialData);
	setContext(ACCOMPLISHMENT_REPORT_TEMPLATE_STATE_KEY, store);
	return store;
}

export type { AccomplishmentReportTemplateState };
