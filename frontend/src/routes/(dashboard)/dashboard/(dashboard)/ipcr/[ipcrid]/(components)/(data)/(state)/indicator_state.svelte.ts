import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const INDICATOR_STATE_KEY = Symbol('INDICATOR_STATE_KEY');

type IndicatorState = {
	currentIndicators: Writable<Tables<'indicator'>[]>;
	size: Writable<number>;
	addIndicator: (indicator: Tables<'indicator'>) => void;
	updateIndicator: (id: string, updates: Partial<Tables<'indicator'>>) => void;
	removeIndicator: (id: string) => void;
	getIndicatorsByCoreFunction: (coreFunctionId: string) => Tables<'indicator'>[];
};

function createIndicatorStore(initialData?: Tables<'indicator'>[]): IndicatorState {
	const currentIndicators = writable<Tables<'indicator'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentIndicators changes
	currentIndicators.subscribe((indicators) => {
		size.set(indicators.length);
	});

	function addIndicator(indicator: Tables<'indicator'>) {
		currentIndicators.update((indicators) => [...indicators, indicator]);
	}

	function updateIndicator(id: string, updates: Partial<Tables<'indicator'>>) {
		currentIndicators.update((indicators) =>
			indicators.map((ind) => (ind.id === id ? { ...ind, ...updates } : ind))
		);
	}

	function removeIndicator(id: string) {
		currentIndicators.update((indicators) => indicators.filter((ind) => ind.id !== id));
	}

	function getIndicatorsByCoreFunction(coreFunctionId: string) {
		let indicators: Tables<'indicator'>[] = [];
		currentIndicators.subscribe((currentIndicators) => {
			indicators = currentIndicators.filter((ind) => ind.core_function_id === coreFunctionId);
		})();
		return indicators;
	}

	return {
		currentIndicators,
		size,
		addIndicator,
		updateIndicator,
		removeIndicator,
		getIndicatorsByCoreFunction
	};
}

export function getIndicatorStore(): IndicatorState {
	const store = getContext<IndicatorState>(INDICATOR_STATE_KEY);
	if (!store) {
		throw new Error('Indicator store not found in context');
	}
	return store;
}

export function setIndicatorStore(initialData?: Tables<'indicator'>[]): IndicatorState {
	const store = createIndicatorStore(initialData);
	setContext(INDICATOR_STATE_KEY, store);
	return store;
}

export type { IndicatorState };
