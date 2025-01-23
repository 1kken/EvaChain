import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const DPCR_STATE_KEY = Symbol('DPCR_STATE_KEY');

type DpcrState = {
	currentDpcrs: Writable<Tables<'dpcr'>[]>;
	addDpcr: (dpcr: Tables<'dpcr'>) => void;
	updateDpcr: (id: string, updates: Partial<Tables<'dpcr'>>) => void;
	removeDpcr: (id: string) => void;
};

function createDpcrStore(initialData?: Tables<'dpcr'>[]): DpcrState {
	const currentDpcrs = writable<Tables<'dpcr'>[]>(initialData || []);

	function addDpcr(dpcr: Tables<'dpcr'>) {
		currentDpcrs.update((dpcrs) => [...dpcrs, dpcr]);
	}

	function updateDpcr(id: string, updates: Partial<Tables<'dpcr'>>) {
		currentDpcrs.update((dpcrs) =>
			dpcrs.map((dpcr) => (dpcr.id === id ? { ...dpcr, ...updates } : dpcr))
		);
	}

	function removeDpcr(id: string) {
		currentDpcrs.update((dpcrs) => dpcrs.filter((dpcr) => dpcr.id !== id));
	}

	return {
		currentDpcrs,
		addDpcr,
		updateDpcr,
		removeDpcr
	};
}

export function getDpcrStore(): DpcrState {
	const store = getContext<DpcrState>(DPCR_STATE_KEY);
	if (!store) {
		throw new Error('DPCR store not found in context');
	}
	return store;
}

export function setDpcrStore(initialData?: Tables<'dpcr'>[]): DpcrState {
	const store = createDpcrStore(initialData);
	setContext(DPCR_STATE_KEY, store);
	return store;
}

export type { DpcrState };
