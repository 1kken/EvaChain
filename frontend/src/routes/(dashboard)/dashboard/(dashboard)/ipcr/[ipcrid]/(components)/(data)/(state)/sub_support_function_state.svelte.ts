import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const SUB_SUPPORT_FUNCTION_STATE_KEY = Symbol('SUB_SUPPORT_FUNCTION_STATE_KEY');

type SubSupportFunctionState = {
	currentSubSupportFunctions: Writable<Tables<'sub_support_function'>[]>;
	size: Writable<number>;
	addSubSupportFunction: (subSupportFunction: Tables<'sub_support_function'>) => void;
	updateSubSupportFunction: (id: string, updates: Partial<Tables<'sub_support_function'>>) => void;
	removeSubSupportFunction: (id: string) => void;
};

function createSubSupportFunctionStore(
	initialData?: Tables<'sub_support_function'>[]
): SubSupportFunctionState {
	const currentSubSupportFunctions = writable<Tables<'sub_support_function'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentSubSupportFunctions changes
	currentSubSupportFunctions.subscribe((functions) => {
		size.set(functions.length);
	});

	function addSubSupportFunction(subSupportFunction: Tables<'sub_support_function'>) {
		currentSubSupportFunctions.update((functions) => [...functions, subSupportFunction]);
	}

	function updateSubSupportFunction(id: string, updates: Partial<Tables<'sub_support_function'>>) {
		currentSubSupportFunctions.update((functions) =>
			functions.map((func) => (func.id === id ? { ...func, ...updates } : func))
		);
	}

	function removeSubSupportFunction(id: string) {
		currentSubSupportFunctions.update((functions) => functions.filter((func) => func.id !== id));
	}

	return {
		currentSubSupportFunctions,
		size,
		addSubSupportFunction,
		updateSubSupportFunction,
		removeSubSupportFunction
	};
}

export function getSubSupportFunctionStore(): SubSupportFunctionState {
	const store = getContext<SubSupportFunctionState>(SUB_SUPPORT_FUNCTION_STATE_KEY);
	if (!store) {
		throw new Error('Sub Support Function store not found in context');
	}
	return store;
}

export function setSubSupportFunctionStore(
	initialData?: Tables<'sub_support_function'>[]
): SubSupportFunctionState {
	const store = createSubSupportFunctionStore(initialData);
	setContext(SUB_SUPPORT_FUNCTION_STATE_KEY, store);
	return store;
}

export type { SubSupportFunctionState };
