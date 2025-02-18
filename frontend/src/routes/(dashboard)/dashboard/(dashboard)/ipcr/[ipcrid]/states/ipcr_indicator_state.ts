import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const IPCR_INDICATOR_STATE_KEY = Symbol('IPCR_INDICATOR_STATE_KEY');

type IpcrIndicatorState = {
	currentIpcrIndicators: Writable<Tables<'ipcr_indicator'>[]>;
	size: Writable<number>;
	addIpcrIndicator: (ipcrIndicator: Tables<'ipcr_indicator'>) => void;
	updateIpcrIndicator: (id: string, updates: Partial<Tables<'ipcr_indicator'>>) => void;
	removeIpcrIndicator: (id: string) => void;
	updateIndicatorRatings: (
		id: string,
		ratings: {
			quality_rating?: number | null;
			efficiency_rating?: number | null;
			timeliness_rating?: number | null;
			average_rating?: number | null;
		}
	) => void;
};

function createIpcrIndicatorStore(initialData?: Tables<'ipcr_indicator'>[]): IpcrIndicatorState {
	const currentIpcrIndicators = writable<Tables<'ipcr_indicator'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentIpcrIndicators changes
	currentIpcrIndicators.subscribe((indicators) => {
		size.set(indicators.length);
	});

	function addIpcrIndicator(ipcrIndicator: Tables<'ipcr_indicator'>) {
		currentIpcrIndicators.update((indicators) => [...indicators, ipcrIndicator]);
	}

	function updateIpcrIndicator(id: string, updates: Partial<Tables<'ipcr_indicator'>>) {
		currentIpcrIndicators.update((indicators) =>
			indicators.map((indicator) =>
				indicator.id === id ? { ...indicator, ...updates } : indicator
			)
		);
	}

	function removeIpcrIndicator(id: string) {
		currentIpcrIndicators.update((indicators) =>
			indicators.filter((indicator) => indicator.id !== id)
		);
	}

	function updateIndicatorRatings(
		id: string,
		ratings: {
			quality_rating?: number | null;
			efficiency_rating?: number | null;
			timeliness_rating?: number | null;
			average_rating?: number | null;
		}
	) {
		currentIpcrIndicators.update((indicators) =>
			indicators.map((indicator) =>
				indicator.id === id ? { ...indicator, ...ratings } : indicator
			)
		);
	}

	return {
		currentIpcrIndicators,
		size,
		addIpcrIndicator,
		updateIpcrIndicator,
		removeIpcrIndicator,
		updateIndicatorRatings
	};
}

export function getIpcrIndicatorStore(): IpcrIndicatorState {
	const store = getContext<IpcrIndicatorState>(IPCR_INDICATOR_STATE_KEY);
	if (!store) {
		throw new Error('IPCR Indicator store not found in context');
	}
	return store;
}

export function setIpcrIndicatorStore(
	initialData?: Tables<'ipcr_indicator'>[]
): IpcrIndicatorState {
	const store = createIpcrIndicatorStore(initialData);
	setContext(IPCR_INDICATOR_STATE_KEY, store);
	return store;
}

export type { IpcrIndicatorState };
