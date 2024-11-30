import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const IPCR_STATE_KEY = Symbol('IPCR_STATE_KEY');

type IPCRState = {
	currentUserIPCR: Writable<Tables<'ipcr'>[]>;
	fetchUserIPCRs: (userId: string) => Promise<void>;
	addIPCR: (ipcr: Tables<'ipcr'>) => void;
	updateIPCR: (id: string, updates: Partial<Tables<'ipcr'>>) => void;
	removeIPCR: (id: string) => void;
};

function createIPCRStore(initialData?: Tables<'ipcr'>[]): IPCRState {
	const currentUserIPCR = writable<Tables<'ipcr'>[]>(initialData || []);

	async function fetchUserIPCRs(userId: string) {
		try {
			const response = await fetch(`/api/ipcr/user/${userId}`);
			if (!response.ok) {
				throw new Error('Failed to fetch IPCRs');
			}
			const data = await response.json();
			currentUserIPCR.set(data);
		} catch (error) {
			console.error('Error fetching IPCRs:', error);
			currentUserIPCR.set([]);
		}
	}

	function addIPCR(ipcr: Tables<'ipcr'>) {
		currentUserIPCR.update((ipcrs) => [...ipcrs, ipcr]);
	}

	function updateIPCR(id: string, updates: Partial<Tables<'ipcr'>>) {
		currentUserIPCR.update((ipcrs) =>
			ipcrs.map((ipcr) => (ipcr.id === id ? { ...ipcr, ...updates } : ipcr))
		);
	}

	function removeIPCR(id: string) {
		currentUserIPCR.update((ipcrs) => ipcrs.filter((ipcr) => ipcr.id !== id));
	}

	return {
		currentUserIPCR,
		fetchUserIPCRs,
		addIPCR,
		updateIPCR,
		removeIPCR
	};
}

// Function to get IPCR store from context
export function getIPCRStore(): IPCRState {
	const store = getContext<IPCRState>(IPCR_STATE_KEY);
	if (!store) {
		throw new Error('IPCR store not found in context');
	}
	return store;
}

// Function to create and set IPCR store in context
export function setIPCRStore(initialData?: Tables<'ipcr'>[]): IPCRState {
	const store = createIPCRStore(initialData);
	setContext(IPCR_STATE_KEY, store);
	return store;
}

export type { IPCRState };
