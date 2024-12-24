import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const IPCR_STATE_KEY = Symbol('IPCR_STATE_KEY');

type IpcrState = {
	currentIpcr: Writable<Tables<'ipcr'> | null>;
	updateIpcr: (updates: Partial<Tables<'ipcr'>>) => void;
	setIpcr: (ipcr: Tables<'ipcr'>) => void;
	clearIpcr: () => void;
};

function createIpcrStore(initialData?: Tables<'ipcr'> | null): IpcrState {
	const currentIpcr = writable<Tables<'ipcr'> | null>(initialData || null);

	function setIpcr(ipcr: Tables<'ipcr'>) {
		currentIpcr.set(ipcr);
	}

	function updateIpcr(updates: Partial<Tables<'ipcr'>>) {
		currentIpcr.update((ipcr) => {
			if (!ipcr) return null;
			return { ...ipcr, ...updates };
		});
	}

	function clearIpcr() {
		currentIpcr.set(null);
	}

	return {
		currentIpcr,
		updateIpcr,
		setIpcr,
		clearIpcr
	};
}

export function getIpcrStore(): IpcrState {
	const store = getContext<IpcrState>(IPCR_STATE_KEY);
	if (!store) {
		throw new Error('IPCR store not found in context');
	}
	return store;
}

export function setIpcrStore(initialData?: Tables<'ipcr'> | null): IpcrState {
	const store = createIpcrStore(initialData);
	setContext(IPCR_STATE_KEY, store);
	return store;
}

export type { IpcrState };
