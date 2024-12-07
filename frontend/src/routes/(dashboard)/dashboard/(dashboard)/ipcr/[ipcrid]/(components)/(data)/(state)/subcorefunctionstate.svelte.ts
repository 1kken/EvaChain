import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const SUB_CORE_FUNCTION_STATE_KEY = Symbol('SUB_CORE_FUNCTION_STATE_KEY');

type SubCoreFunctionState = {
	currentSubCoreFunctions: Writable<Tables<'sub_core_function'>[]>;
	size: Writable<number>;
	addSubCoreFunction: (subCoreFunction: Tables<'sub_core_function'>) => void;
	updateSubCoreFunction: (id: string, updates: Partial<Tables<'sub_core_function'>>) => void;
	removeSubCoreFunction: (id: string) => void;
};

function createSubCoreFunctionStore(
	initialData?: Tables<'sub_core_function'>[]
): SubCoreFunctionState {
	const currentSubCoreFunctions = writable<Tables<'sub_core_function'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentSubCoreFunctions changes
	currentSubCoreFunctions.subscribe((functions) => {
		size.set(functions.length);
	});

	function addSubCoreFunction(subCoreFunction: Tables<'sub_core_function'>) {
		currentSubCoreFunctions.update((functions) => [...functions, subCoreFunction]);
	}

	function updateSubCoreFunction(id: string, updates: Partial<Tables<'sub_core_function'>>) {
		currentSubCoreFunctions.update((functions) =>
			functions.map((func) => (func.id === id ? { ...func, ...updates } : func))
		);
	}

	function removeSubCoreFunction(id: string) {
		currentSubCoreFunctions.update((functions) => functions.filter((func) => func.id !== id));
	}

	return {
		currentSubCoreFunctions,
		size,
		addSubCoreFunction,
		updateSubCoreFunction,
		removeSubCoreFunction
	};
}

export function getSubCoreFunctionStore(): SubCoreFunctionState {
	const store = getContext<SubCoreFunctionState>(SUB_CORE_FUNCTION_STATE_KEY);
	if (!store) {
		throw new Error('Sub Core Function store not found in context');
	}
	return store;
}

export function setSubCoreFunctionStore(
	initialData?: Tables<'sub_core_function'>[]
): SubCoreFunctionState {
	const store = createSubCoreFunctionStore(initialData);
	setContext(SUB_CORE_FUNCTION_STATE_KEY, store);
	return store;
}

export type { SubCoreFunctionState };
