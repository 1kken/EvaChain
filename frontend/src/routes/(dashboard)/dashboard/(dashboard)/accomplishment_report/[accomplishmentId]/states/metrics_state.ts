import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const ACCOMPLISHMENT_METRICS_STATE_KEY = Symbol('ACCOMPLISHMENT_METRICS_STATE_KEY');

type AccomplishmentMetricsState = {
	currentAccomplishmentMetrics: Writable<Tables<'accomplishment_metrics'>[]>;
	size: Writable<number>;
	addAccomplishmentMetric: (metric: Tables<'accomplishment_metrics'>) => void;
	updateAccomplishmentMetric: (
		id: string,
		updates: Partial<Tables<'accomplishment_metrics'>>
	) => void;
	removeAccomplishmentMetric: (id: string) => void;
};

function createAccomplishmentMetricsStore(
	initialData?: Tables<'accomplishment_metrics'>[]
): AccomplishmentMetricsState {
	const currentAccomplishmentMetrics = writable<Tables<'accomplishment_metrics'>[]>(
		initialData || []
	);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentAccomplishmentMetrics changes
	currentAccomplishmentMetrics.subscribe((metrics) => {
		size.set(metrics.length);
	});

	function addAccomplishmentMetric(metric: Tables<'accomplishment_metrics'>) {
		currentAccomplishmentMetrics.update((metrics) => [...metrics, metric]);
	}

	function updateAccomplishmentMetric(
		id: string,
		updates: Partial<Tables<'accomplishment_metrics'>>
	) {
		currentAccomplishmentMetrics.update((metrics) =>
			metrics.map((metric) => (metric.id === id ? { ...metric, ...updates } : metric))
		);
	}

	function removeAccomplishmentMetric(id: string) {
		currentAccomplishmentMetrics.update((metrics) => metrics.filter((metric) => metric.id !== id));
	}

	return {
		currentAccomplishmentMetrics,
		size,
		addAccomplishmentMetric,
		updateAccomplishmentMetric,
		removeAccomplishmentMetric
	};
}

export function getAccomplishmentMetricsStore(): AccomplishmentMetricsState {
	const store = getContext<AccomplishmentMetricsState>(ACCOMPLISHMENT_METRICS_STATE_KEY);
	if (!store) {
		throw new Error('Accomplishment Metrics store not found in context');
	}
	return store;
}

export function setAccomplishmentMetricsStore(
	initialData?: Tables<'accomplishment_metrics'>[]
): AccomplishmentMetricsState {
	const store = createAccomplishmentMetricsStore(initialData);
	setContext(ACCOMPLISHMENT_METRICS_STATE_KEY, store);
	return store;
}
