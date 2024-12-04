import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const IPCR_STATE_KEY = Symbol('IPCR_STATE_KEY');

type IPCRState = {
	currentUserIPCR: Writable<Tables<'ipcr_teaching'>[]>;
	addIPCR: (ipcr: Tables<'ipcr_teaching'>) => void;
	updateIPCR: (id: string, updates: Partial<Tables<'ipcr_teaching'>>) => void;
	removeIPCR: (id: string) => void;
};

function createIPCRStore(initialData?: Tables<'ipcr_teaching'>[]): IPCRState {
	const currentUserIPCR = writable<Tables<'ipcr_teaching'>[]>(initialData || []);

	function addIPCR(ipcr: Tables<'ipcr_teaching'>) {
		currentUserIPCR.update((ipcrs) => [...ipcrs, ipcr]);
	}

	function updateIPCR(id: string, updates: Partial<Tables<'ipcr_teaching'>>) {
		currentUserIPCR.update((ipcrs) =>
			ipcrs.map((ipcr) => (ipcr.id === id ? { ...ipcr, ...updates } : ipcr))
		);
	}

	function removeIPCR(id: string) {
		currentUserIPCR.update((ipcrs) => ipcrs.filter((ipcr) => ipcr.id !== id));
	}

	return {
		currentUserIPCR,
		addIPCR,
		updateIPCR,
		removeIPCR
	};
}

export function getIPCRStore(): IPCRState {
	const store = getContext<IPCRState>(IPCR_STATE_KEY);
	if (!store) {
		throw new Error('IPCR store not found in context');
	}
	return store;
}

export function setIPCRStore(initialData?: Tables<'ipcr_teaching'>[]): IPCRState {
	const store = createIPCRStore(initialData);
	setContext(IPCR_STATE_KEY, store);
	return store;
}

export type { IPCRState };
