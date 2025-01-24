import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const DPCR_INDICATOR_STATE_KEY = Symbol('DPCR_INDICATOR_STATE_KEY');

type DpcrIndicatorState = {
	currentDpcrIndicators: Writable<Tables<'dpcr_indicator'>[]>;
	size: Writable<number>;
	addDpcrIndicator: (indicator: Tables<'dpcr_indicator'>) => void;
	updateDpcrIndicator: (id: string, updates: Partial<Tables<'dpcr_indicator'>>) => void;
	removeDpcrIndicator: (id: string) => void;
	getDpcrIndicatorsByFunctionId: (functionId: string) => Tables<'dpcr_indicator'>[];
	getDpcrIndicatorsByCategoryId: (categoryId: string) => Tables<'dpcr_indicator'>[];
};

function createDpcrIndicatorStore(initialData?: Tables<'dpcr_indicator'>[]): DpcrIndicatorState {
	const currentDpcrIndicators = writable<Tables<'dpcr_indicator'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	currentDpcrIndicators.subscribe((indicators) => {
		size.set(indicators.length);
	});

	function addDpcrIndicator(indicator: Tables<'dpcr_indicator'>) {
		currentDpcrIndicators.update((indicators) => [...indicators, indicator]);
	}

	function updateDpcrIndicator(id: string, updates: Partial<Tables<'dpcr_indicator'>>) {
		currentDpcrIndicators.update((indicators) =>
			indicators.map((ind) => (ind.id === id ? { ...ind, ...updates } : ind))
		);
	}

	function removeDpcrIndicator(id: string) {
		currentDpcrIndicators.update((indicators) => indicators.filter((ind) => ind.id !== id));
	}

	function getDpcrIndicatorsByFunctionId(functionId: string): Tables<'dpcr_indicator'>[] {
		let indicators: Tables<'dpcr_indicator'>[] = [];
		currentDpcrIndicators.subscribe((inds) => {
			indicators = inds.filter((ind) => ind.dpcr_function_id === functionId);
		})();
		return indicators;
	}

	function getDpcrIndicatorsByCategoryId(categoryId: string): Tables<'dpcr_indicator'>[] {
		let indicators: Tables<'dpcr_indicator'>[] = [];
		currentDpcrIndicators.subscribe((inds) => {
			indicators = inds.filter((ind) => ind.dpcr_function_category_id === categoryId);
		})();
		return indicators;
	}

	return {
		currentDpcrIndicators,
		size,
		addDpcrIndicator,
		updateDpcrIndicator,
		removeDpcrIndicator,
		getDpcrIndicatorsByFunctionId,
		getDpcrIndicatorsByCategoryId
	};
}

export function getDpcrIndicatorStore(): DpcrIndicatorState {
	const store = getContext<DpcrIndicatorState>(DPCR_INDICATOR_STATE_KEY);
	if (!store) {
		throw new Error('DPCR Indicator store not found in context');
	}
	return store;
}

export function setDpcrIndicatorStore(
	initialData?: Tables<'dpcr_indicator'>[]
): DpcrIndicatorState {
	const store = createDpcrIndicatorStore(initialData);
	setContext(DPCR_INDICATOR_STATE_KEY, store);
	return store;
}

export type { DpcrIndicatorState };
