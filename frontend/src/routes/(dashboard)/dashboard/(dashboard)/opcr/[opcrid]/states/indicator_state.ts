import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const OPCR_INDICATOR_STATE_KEY = Symbol('OPCR_INDICATOR_STATE_KEY');

type OpcrIndicatorState = {
	currentOpcrIndicators: Writable<Tables<'opcr_indicator'>[]>;
	size: Writable<number>;
	addOpcrIndicator: (indicator: Tables<'opcr_indicator'>) => void;
	updateOpcrIndicator: (id: string, updates: Partial<Tables<'opcr_indicator'>>) => void;
	removeOpcrIndicator: (id: string) => void;
	getOpcrIndicatorsByFunctionId: (functionId: string) => Tables<'opcr_indicator'>[];
	getOpcrIndicatorsByCategoryId: (categoryId: string) => Tables<'opcr_indicator'>[];
};

function createOpcrIndicatorStore(initialData?: Tables<'opcr_indicator'>[]): OpcrIndicatorState {
	const currentOpcrIndicators = writable<Tables<'opcr_indicator'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	currentOpcrIndicators.subscribe((indicators) => {
		size.set(indicators.length);
	});

	function addOpcrIndicator(indicator: Tables<'opcr_indicator'>) {
		currentOpcrIndicators.update((indicators) => [...indicators, indicator]);
	}

	function updateOpcrIndicator(id: string, updates: Partial<Tables<'opcr_indicator'>>) {
		currentOpcrIndicators.update((indicators) =>
			indicators.map((ind) => (ind.id === id ? { ...ind, ...updates } : ind))
		);
	}

	function removeOpcrIndicator(id: string) {
		currentOpcrIndicators.update((indicators) => indicators.filter((ind) => ind.id !== id));
	}

	function getOpcrIndicatorsByFunctionId(functionId: string): Tables<'opcr_indicator'>[] {
		let indicators: Tables<'opcr_indicator'>[] = [];
		currentOpcrIndicators.subscribe((inds) => {
			indicators = inds.filter((ind) => ind.opcr_function_id === functionId);
		})();
		return indicators;
	}

	function getOpcrIndicatorsByCategoryId(categoryId: string): Tables<'opcr_indicator'>[] {
		let indicators: Tables<'opcr_indicator'>[] = [];
		currentOpcrIndicators.subscribe((inds) => {
			indicators = inds.filter((ind) => ind.opcr_function_category_id === categoryId);
		})();
		return indicators;
	}

	return {
		currentOpcrIndicators,
		size,
		addOpcrIndicator,
		updateOpcrIndicator,
		removeOpcrIndicator,
		getOpcrIndicatorsByFunctionId,
		getOpcrIndicatorsByCategoryId
	};
}

export function getOpcrIndicatorStore(): OpcrIndicatorState {
	const store = getContext<OpcrIndicatorState>(OPCR_INDICATOR_STATE_KEY);
	if (!store) {
		throw new Error('OPCR Indicator store not found in context');
	}
	return store;
}

export function setOpcrIndicatorStore(
	initialData?: Tables<'opcr_indicator'>[]
): OpcrIndicatorState {
	const store = createOpcrIndicatorStore(initialData);
	setContext(OPCR_INDICATOR_STATE_KEY, store);
	return store;
}

export type { OpcrIndicatorState };
