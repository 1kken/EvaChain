import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const CURRENT_OPCR_STATE_KEY = Symbol('CURRENT_OPCR_STATE_KEY');

type CurrentOpcrState = {
	currentOpcr: Writable<Tables<'opcr'> | null>;
	setOpcr: (opcr: Tables<'opcr'>) => void;
	resetOpcr: () => void;
};

function createCurrentOpcrStore(initialData?: Tables<'opcr'>): CurrentOpcrState {
	const currentOpcr = writable<Tables<'opcr'> | null>(initialData || null);

	function setOpcr(opcr: Tables<'opcr'>) {
		currentOpcr.set(opcr);
	}

	function resetOpcr() {
		currentOpcr.set(null);
	}

	return {
		currentOpcr,
		setOpcr,
		resetOpcr
	};
}

export function getCurrentOpcrStore(): CurrentOpcrState {
	const store = getContext<CurrentOpcrState>(CURRENT_OPCR_STATE_KEY);
	if (!store) {
		throw new Error('Current OPCR store not found in context');
	}
	return store;
}

export function setCurrentOpcrStore(initialData?: Tables<'opcr'>): CurrentOpcrState {
	const store = createCurrentOpcrStore(initialData);
	setContext(CURRENT_OPCR_STATE_KEY, store);
	return store;
}

export type { CurrentOpcrState };
