import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const OPCR_FUNCTION_STATE_KEY = Symbol('OPCR_FUNCTION_STATE_KEY');

type OpcrFunctionState = {
	currentOpcrFunctions: Writable<Tables<'opcr_function'>[]>;
	size: Writable<number>;
	addOpcrFunction: (opcrFunction: Tables<'opcr_function'>) => void;
	updateOpcrFunction: (id: string, updates: Partial<Tables<'opcr_function'>>) => void;
	removeOpcrFunction: (id: string) => void;
};

function createOpcrFunctionStore(initialData?: Tables<'opcr_function'>[]): OpcrFunctionState {
	const currentOpcrFunctions = writable<Tables<'opcr_function'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	currentOpcrFunctions.subscribe((functions) => {
		size.set(functions.length);
	});

	function addOpcrFunction(opcrFunction: Tables<'opcr_function'>) {
		currentOpcrFunctions.update((functions) => [...functions, opcrFunction]);
	}

	function updateOpcrFunction(id: string, updates: Partial<Tables<'opcr_function'>>) {
		currentOpcrFunctions.update((functions) =>
			functions.map((fn) => (fn.id === id ? { ...fn, ...updates } : fn))
		);
	}

	function removeOpcrFunction(id: string) {
		currentOpcrFunctions.update((functions) => functions.filter((fn) => fn.id !== id));
	}

	return {
		currentOpcrFunctions,
		size,
		addOpcrFunction,
		updateOpcrFunction,
		removeOpcrFunction
	};
}

export function getOpcrFunctionStore(): OpcrFunctionState {
	const store = getContext<OpcrFunctionState>(OPCR_FUNCTION_STATE_KEY);
	if (!store) {
		throw new Error('OPCR Function store not found in context');
	}
	return store;
}

export function setOpcrFunctionStore(initialData?: Tables<'opcr_function'>[]): OpcrFunctionState {
	const store = createOpcrFunctionStore(initialData);
	setContext(OPCR_FUNCTION_STATE_KEY, store);
	return store;
}

export type { OpcrFunctionState };
