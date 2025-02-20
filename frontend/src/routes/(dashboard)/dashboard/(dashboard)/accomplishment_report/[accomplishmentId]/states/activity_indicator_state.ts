import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const ACCOMPLISHMENT_ACTIVITY_INDICATOR_STATE_KEY = Symbol(
	'ACCOMPLISHMENT_ACTIVITY_INDICATOR_STATE_KEY'
);

type AccomplishmentActivityIndicatorState = {
	currentAccomplishmentActivityIndicators: Writable<Tables<'accomplishment_activity_indicator'>[]>;
	size: Writable<number>;
	addAccomplishmentActivityIndicator: (
		indicator: Tables<'accomplishment_activity_indicator'>
	) => void;
	updateAccomplishmentActivityIndicator: (
		id: string,
		updates: Partial<Tables<'accomplishment_activity_indicator'>>
	) => void;
	removeAccomplishmentActivityIndicator: (id: string) => void;
};

function createAccomplishmentActivityIndicatorStore(
	initialData?: Tables<'accomplishment_activity_indicator'>[]
): AccomplishmentActivityIndicatorState {
	const currentAccomplishmentActivityIndicators = writable<
		Tables<'accomplishment_activity_indicator'>[]
	>(initialData || []);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentAccomplishmentActivityIndicators changes
	currentAccomplishmentActivityIndicators.subscribe((indicators) => {
		size.set(indicators.length);
	});

	function addAccomplishmentActivityIndicator(
		indicator: Tables<'accomplishment_activity_indicator'>
	) {
		currentAccomplishmentActivityIndicators.update((indicators) => [...indicators, indicator]);
	}

	function updateAccomplishmentActivityIndicator(
		id: string,
		updates: Partial<Tables<'accomplishment_activity_indicator'>>
	) {
		currentAccomplishmentActivityIndicators.update((indicators) =>
			indicators.map((indicator) =>
				indicator.id === id ? { ...indicator, ...updates } : indicator
			)
		);
	}

	function removeAccomplishmentActivityIndicator(id: string) {
		currentAccomplishmentActivityIndicators.update((indicators) =>
			indicators.filter((indicator) => indicator.id !== id)
		);
	}

	return {
		currentAccomplishmentActivityIndicators,
		size,
		addAccomplishmentActivityIndicator,
		updateAccomplishmentActivityIndicator,
		removeAccomplishmentActivityIndicator
	};
}

export function getAccomplishmentActivityIndicatorStore(): AccomplishmentActivityIndicatorState {
	const store = getContext<AccomplishmentActivityIndicatorState>(
		ACCOMPLISHMENT_ACTIVITY_INDICATOR_STATE_KEY
	);
	if (!store) {
		throw new Error('Accomplishment Activity Indicator store not found in context');
	}
	return store;
}

export function setAccomplishmentActivityIndicatorStore(
	initialData?: Tables<'accomplishment_activity_indicator'>[]
): AccomplishmentActivityIndicatorState {
	const store = createAccomplishmentActivityIndicatorStore(initialData);
	setContext(ACCOMPLISHMENT_ACTIVITY_INDICATOR_STATE_KEY, store);
	return store;
}

export type { AccomplishmentActivityIndicatorState };
