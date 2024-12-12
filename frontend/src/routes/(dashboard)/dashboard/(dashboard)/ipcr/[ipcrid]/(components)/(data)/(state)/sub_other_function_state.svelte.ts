import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const SUB_OTHER_FUNCTION_STATE_KEY = Symbol('SUB_OTHER_FUNCTION_STATE_KEY');

type SubOtherFunctionState = {
	currentSubOtherFunctions: Writable<Tables<'sub_other_function'>[]>;
	size: Writable<number>;
	addSubOtherFunction: (subOtherFunction: Tables<'sub_other_function'>) => void;
	updateSubOtherFunction: (id: string, updates: Partial<Tables<'sub_other_function'>>) => void;
	removeSubOtherFunction: (id: string) => void;
};

function createSubOtherFunctionStore(
	initialData?: Tables<'sub_other_function'>[]
): SubOtherFunctionState {
	const currentSubOtherFunctions = writable<Tables<'sub_other_function'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentSubOtherFunctions changes
	currentSubOtherFunctions.subscribe((functions) => {
		size.set(functions.length);
	});

	function addSubOtherFunction(subOtherFunction: Tables<'sub_other_function'>) {
		currentSubOtherFunctions.update((functions) => [...functions, subOtherFunction]);
	}

	function updateSubOtherFunction(id: string, updates: Partial<Tables<'sub_other_function'>>) {
		currentSubOtherFunctions.update((functions) =>
			functions.map((func) => (func.id === id ? { ...func, ...updates } : func))
		);
	}

	function removeSubOtherFunction(id: string) {
		currentSubOtherFunctions.update((functions) => functions.filter((func) => func.id !== id));
	}

	return {
		currentSubOtherFunctions,
		size,
		addSubOtherFunction,
		updateSubOtherFunction,
		removeSubOtherFunction
	};
}

export function getSubOtherFunctionStore(): SubOtherFunctionState {
	const store = getContext<SubOtherFunctionState>(SUB_OTHER_FUNCTION_STATE_KEY);
	if (!store) {
		throw new Error('Sub Other Function store not found in context');
	}
	return store;
}

export function setSubOtherFunctionStore(
	initialData?: Tables<'sub_other_function'>[]
): SubOtherFunctionState {
	const store = createSubOtherFunctionStore(initialData);
	setContext(SUB_OTHER_FUNCTION_STATE_KEY, store);
	return store;
}

export type { SubOtherFunctionState };
