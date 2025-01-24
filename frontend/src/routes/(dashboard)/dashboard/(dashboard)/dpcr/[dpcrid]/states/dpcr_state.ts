import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const CURRENT_DPCR_STATE_KEY = Symbol('CURRENT_DPCR_STATE_KEY');

type CurrentDpcrState = {
	currentDpcr: Writable<Tables<'dpcr'> | null>;
	setDpcr: (dpcr: Tables<'dpcr'>) => void;
	resetDpcr: () => void;
};

function createCurrentDpcrStore(initialData?: Tables<'dpcr'>): CurrentDpcrState {
	const currentDpcr = writable<Tables<'dpcr'> | null>(initialData || null);

	function setDpcr(dpcr: Tables<'dpcr'>) {
		currentDpcr.set(dpcr);
	}

	function resetDpcr() {
		currentDpcr.set(null);
	}

	return {
		currentDpcr,
		setDpcr,
		resetDpcr
	};
}

export function getCurrentDpcrStore(): CurrentDpcrState {
	const store = getContext<CurrentDpcrState>(CURRENT_DPCR_STATE_KEY);
	if (!store) {
		throw new Error('Current DPCR store not found in context');
	}
	return store;
}

export function setCurrentDpcrStore(initialData?: Tables<'dpcr'>): CurrentDpcrState {
	const store = createCurrentDpcrStore(initialData);
	setContext(CURRENT_DPCR_STATE_KEY, store);
	return store;
}

export type { CurrentDpcrState };
