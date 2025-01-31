import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const OPCR_STATE_KEY = Symbol('OPCR_STATE_KEY');

type OpcrState = {
	currentOpcrs: Writable<Tables<'opcr'>[]>;
	addOpcr: (opcr: Tables<'opcr'>) => void;
	updateOpcr: (id: string, updates: Partial<Tables<'opcr'>>) => void;
	removeOpcr: (id: string) => void;
};

function createOpcrStore(initialData?: Tables<'opcr'>[]): OpcrState {
	const currentOpcrs = writable<Tables<'opcr'>[]>(initialData || []);

	function addOpcr(opcr: Tables<'opcr'>) {
		currentOpcrs.update((opcrs) => [...opcrs, opcr]);
	}

	function updateOpcr(id: string, updates: Partial<Tables<'opcr'>>) {
		currentOpcrs.update((opcrs) =>
			opcrs.map((opcr) => (opcr.id === id ? { ...opcr, ...updates } : opcr))
		);
	}

	function removeOpcr(id: string) {
		currentOpcrs.update((opcrs) => opcrs.filter((opcr) => opcr.id !== id));
	}

	return {
		currentOpcrs,
		addOpcr,
		updateOpcr,
		removeOpcr
	};
}

export function getOpcrStore(): OpcrState {
	const store = getContext<OpcrState>(OPCR_STATE_KEY);
	if (!store) {
		throw new Error('OPCR store not found in context');
	}
	return store;
}

export function setOpcrStore(initialData?: Tables<'opcr'>[]): OpcrState {
	const store = createOpcrStore(initialData);
	setContext(OPCR_STATE_KEY, store);
	return store;
}

export type { OpcrState };
