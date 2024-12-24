import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const IPCR_FUNCTION_STATE_KEY = Symbol('IPCR_FUNCTION_STATE_KEY');

type IpcrFunctionState = {
	currentIpcrFunctions: Writable<Tables<'ipcr_function'>[]>;
	size: Writable<number>;
	addIpcrFunction: (ipcrFunction: Tables<'ipcr_function'>) => void;
	updateIpcrFunction: (id: string, updates: Partial<Tables<'ipcr_function'>>) => void;
	removeIpcrFunction: (id: string) => void;
};

function createIpcrFunctionStore(initialData?: Tables<'ipcr_function'>[]): IpcrFunctionState {
	const currentIpcrFunctions = writable<Tables<'ipcr_function'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentIpcrFunctions changes
	currentIpcrFunctions.subscribe((functions) => {
		size.set(functions.length);
	});

	function addIpcrFunction(ipcrFunction: Tables<'ipcr_function'>) {
		currentIpcrFunctions.update((functions) => [...functions, ipcrFunction]);
	}

	function updateIpcrFunction(id: string, updates: Partial<Tables<'ipcr_function'>>) {
		currentIpcrFunctions.update((functions) =>
			functions.map((func) => (func.id === id ? { ...func, ...updates } : func))
		);
	}

	function removeIpcrFunction(id: string) {
		currentIpcrFunctions.update((functions) => functions.filter((func) => func.id !== id));
	}

	return {
		currentIpcrFunctions,
		size,
		addIpcrFunction,
		updateIpcrFunction,
		removeIpcrFunction
	};
}

export function getIpcrFunctionStore(): IpcrFunctionState {
	const store = getContext<IpcrFunctionState>(IPCR_FUNCTION_STATE_KEY);
	if (!store) {
		throw new Error('IPCR Function store not found in context');
	}
	return store;
}

export function setIpcrFunctionStore(initialData?: Tables<'ipcr_function'>[]): IpcrFunctionState {
	const store = createIpcrFunctionStore(initialData);
	setContext(IPCR_FUNCTION_STATE_KEY, store);
	return store;
}

export type { IpcrFunctionState };
