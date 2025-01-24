import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const DPCR_FUNCTION_STATE_KEY = Symbol('DPCR_FUNCTION_STATE_KEY');

type DpcrFunctionState = {
	currentDpcrFunctions: Writable<Tables<'dpcr_function'>[]>;
	size: Writable<number>;
	addDpcrFunction: (dpcrFunction: Tables<'dpcr_function'>) => void;
	updateDpcrFunction: (id: string, updates: Partial<Tables<'dpcr_function'>>) => void;
	removeDpcrFunction: (id: string) => void;
};

function createDpcrFunctionStore(initialData?: Tables<'dpcr_function'>[]): DpcrFunctionState {
	const currentDpcrFunctions = writable<Tables<'dpcr_function'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	currentDpcrFunctions.subscribe((functions) => {
		size.set(functions.length);
	});

	function addDpcrFunction(dpcrFunction: Tables<'dpcr_function'>) {
		currentDpcrFunctions.update((functions) => [...functions, dpcrFunction]);
	}

	function updateDpcrFunction(id: string, updates: Partial<Tables<'dpcr_function'>>) {
		currentDpcrFunctions.update((functions) =>
			functions.map((fn) => (fn.id === id ? { ...fn, ...updates } : fn))
		);
	}

	function removeDpcrFunction(id: string) {
		currentDpcrFunctions.update((functions) => functions.filter((fn) => fn.id !== id));
	}

	return {
		currentDpcrFunctions,
		size,
		addDpcrFunction,
		updateDpcrFunction,
		removeDpcrFunction
	};
}

export function getDpcrFunctionStore(): DpcrFunctionState {
	const store = getContext<DpcrFunctionState>(DPCR_FUNCTION_STATE_KEY);
	if (!store) {
		throw new Error('DPCR Function store not found in context');
	}
	return store;
}

export function setDpcrFunctionStore(initialData?: Tables<'dpcr_function'>[]): DpcrFunctionState {
	const store = createDpcrFunctionStore(initialData);
	setContext(DPCR_FUNCTION_STATE_KEY, store);
	return store;
}

export type { DpcrFunctionState };
