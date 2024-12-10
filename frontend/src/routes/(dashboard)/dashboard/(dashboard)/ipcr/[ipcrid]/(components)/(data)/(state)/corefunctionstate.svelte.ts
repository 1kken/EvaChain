import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const CORE_FUNCTION_STATE_KEY = Symbol('CORE_FUNCTION_STATE_KEY');

type CoreFunctionState = {
	currentCoreFunctions: Writable<Tables<'core_function'>[]>;
	size: Writable<number>;
	currentIPCRid: Writable<string | null>;
	addCoreFunction: (coreFunction: Tables<'core_function'>) => void;
	updateCoreFunction: (id: string, updates: Partial<Tables<'core_function'>>) => void;
	removeCoreFunction: (id: string) => void;
};

function createCoreFunctionStore(initialData?: Tables<'core_function'>[]): CoreFunctionState {
	const currentCoreFunctions = writable<Tables<'core_function'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);
	const currentIPCRid = writable<string | null>();

	// Update size whenever currentCoreFunctions changes
	currentCoreFunctions.subscribe((functions) => {
		size.set(functions.length);
	});

	function addCoreFunction(coreFunction: Tables<'core_function'>) {
		currentCoreFunctions.update((functions) => [...functions, coreFunction]);
	}

	function updateCoreFunction(id: string, updates: Partial<Tables<'core_function'>>) {
		currentCoreFunctions.update((functions) =>
			functions.map((func) => (func.id === id ? { ...func, ...updates } : func))
		);
	}

	function removeCoreFunction(id: string) {
		currentCoreFunctions.update((functions) => functions.filter((func) => func.id !== id));
	}

	return {
		currentCoreFunctions,
		currentIPCRid,
		size,
		addCoreFunction,
		updateCoreFunction,
		removeCoreFunction
	};
}

export function getCoreFunctionStore(): CoreFunctionState {
	const store = getContext<CoreFunctionState>(CORE_FUNCTION_STATE_KEY);
	if (!store) {
		throw new Error('Core Function store not found in context');
	}
	return store;
}

export function setCoreFunctionStore(initialData?: Tables<'core_function'>[]): CoreFunctionState {
	const store = createCoreFunctionStore(initialData);
	setContext(CORE_FUNCTION_STATE_KEY, store);
	return store;
}

export type { CoreFunctionState };
