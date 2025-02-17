import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const OP_INDICATOR_STATE_KEY = Symbol('OP_INDICATOR_STATE_KEY');

type OpIndicatorState = {
	currentOpIndicators: Writable<Tables<'op_activity_indicator'>[]>;
	size: Writable<number>;
	addOpIndicator: (opIndicator: Tables<'op_activity_indicator'>) => void;
	updateOpIndicator: (id: string, updates: Partial<Tables<'op_activity_indicator'>>) => void;
	removeOpIndicator: (id: string) => void;
};

function createOpIndicatorStore(initialData?: Tables<'op_activity_indicator'>[]): OpIndicatorState {
	const currentOpIndicators = writable<Tables<'op_activity_indicator'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentOpIndicators changes
	currentOpIndicators.subscribe((indicators) => {
		size.set(indicators.length);
	});

	function addOpIndicator(opIndicator: Tables<'op_activity_indicator'>) {
		currentOpIndicators.update((indicators) => [...indicators, opIndicator]);
	}

	function updateOpIndicator(id: string, updates: Partial<Tables<'op_activity_indicator'>>) {
		currentOpIndicators.update((indicators) =>
			indicators.map((indicator) =>
				indicator.id === id ? { ...indicator, ...updates } : indicator
			)
		);
	}

	function removeOpIndicator(id: string) {
		currentOpIndicators.update((indicators) =>
			indicators.filter((indicator) => indicator.id !== id)
		);
	}

	return {
		currentOpIndicators,
		size,
		addOpIndicator,
		updateOpIndicator,
		removeOpIndicator
	};
}

export function getOpIndicatorStore(): OpIndicatorState {
	const store = getContext<OpIndicatorState>(OP_INDICATOR_STATE_KEY);
	if (!store) {
		throw new Error('Op Indicator store not found in context');
	}
	return store;
}

export function setOpIndicatorStore(
	initialData?: Tables<'op_activity_indicator'>[]
): OpIndicatorState {
	const store = createOpIndicatorStore(initialData);
	setContext(OP_INDICATOR_STATE_KEY, store);
	return store;
}

export type { OpIndicatorState };
