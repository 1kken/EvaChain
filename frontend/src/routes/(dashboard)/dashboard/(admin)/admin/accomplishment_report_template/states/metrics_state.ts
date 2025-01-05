import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const ACCOMPLISHMENT_METRICS_TEMPLATE_STATE_KEY = Symbol(
	'ACCOMPLISHMENT_METRICS_TEMPLATE_STATE_KEY'
);

type AccomplishmentMetricsTemplateState = {
	currentAccomplishmentMetricsTemplate: Writable<Tables<'accomplishment_template_metrics'>[]>;
	size: Writable<number>;
	addAccomplishmentMetricTemplate: (metric: Tables<'accomplishment_template_metrics'>) => void;
	updateAccomplishmentMetricTemplate: (
		id: string,
		updates: Partial<Tables<'accomplishment_template_metrics'>>
	) => void;
	removeAccomplishmentMetricTemplate: (id: string) => void;
};

function createAccomplishmentMetricsTemplateStore(
	initialData?: Tables<'accomplishment_template_metrics'>[]
): AccomplishmentMetricsTemplateState {
	const currentAccomplishmentMetricsTemplate = writable<
		Tables<'accomplishment_template_metrics'>[]
	>(initialData || []);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentAccomplishmentMetricsTemplate changes
	currentAccomplishmentMetricsTemplate.subscribe((metrics) => {
		size.set(metrics.length);
	});

	function addAccomplishmentMetricTemplate(metric: Tables<'accomplishment_template_metrics'>) {
		currentAccomplishmentMetricsTemplate.update((metrics) => [...metrics, metric]);
	}

	function updateAccomplishmentMetricTemplate(
		id: string,
		updates: Partial<Tables<'accomplishment_template_metrics'>>
	) {
		currentAccomplishmentMetricsTemplate.update((metrics) =>
			metrics.map((metric) => (metric.id === id ? { ...metric, ...updates } : metric))
		);
	}

	function removeAccomplishmentMetricTemplate(id: string) {
		currentAccomplishmentMetricsTemplate.update((metrics) =>
			metrics.filter((metric) => metric.id !== id)
		);
	}

	return {
		currentAccomplishmentMetricsTemplate,
		size,
		addAccomplishmentMetricTemplate,
		updateAccomplishmentMetricTemplate,
		removeAccomplishmentMetricTemplate
	};
}

export function getAccomplishmentMetricsTemplateStore(): AccomplishmentMetricsTemplateState {
	const store = getContext<AccomplishmentMetricsTemplateState>(
		ACCOMPLISHMENT_METRICS_TEMPLATE_STATE_KEY
	);
	if (!store) {
		throw new Error('Accomplishment Metrics Template store not found in context');
	}
	return store;
}

export function setAccomplishmentMetricsTemplateStore(
	initialData?: Tables<'accomplishment_template_metrics'>[]
): AccomplishmentMetricsTemplateState {
	const store = createAccomplishmentMetricsTemplateStore(initialData);
	setContext(ACCOMPLISHMENT_METRICS_TEMPLATE_STATE_KEY, store);
	return store;
}
