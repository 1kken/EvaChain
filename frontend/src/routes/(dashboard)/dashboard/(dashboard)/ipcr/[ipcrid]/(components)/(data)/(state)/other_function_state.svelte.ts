import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const OTHER_FUNCTION_STATE_KEY = Symbol('OTHER_FUNCTION_STATE_KEY');

type OtherFunctionState = {
	currentOtherFunctions: Writable<Tables<'other_function'>[]>;
	size: Writable<number>;
	addOtherFunction: (otherFunction: Tables<'other_function'>) => void;
	updateOtherFunction: (id: string, updates: Partial<Tables<'other_function'>>) => void;
	removeOtherFunction: (id: string) => void;
};

function createOtherFunctionStore(initialData?: Tables<'other_function'>[]): OtherFunctionState {
	const currentOtherFunctions = writable<Tables<'other_function'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentOtherFunctions changes
	currentOtherFunctions.subscribe((functions) => {
		size.set(functions.length);
	});

	function addOtherFunction(otherFunction: Tables<'other_function'>) {
		currentOtherFunctions.update((functions) => [...functions, otherFunction]);
	}

	function updateOtherFunction(id: string, updates: Partial<Tables<'other_function'>>) {
		currentOtherFunctions.update((functions) =>
			functions.map((func) => (func.id === id ? { ...func, ...updates } : func))
		);
	}

	function removeOtherFunction(id: string) {
		currentOtherFunctions.update((functions) => functions.filter((func) => func.id !== id));
	}

	return {
		currentOtherFunctions,
		size,
		addOtherFunction,
		updateOtherFunction,
		removeOtherFunction
	};
}

export function getOtherFunctionStore(): OtherFunctionState {
	const store = getContext<OtherFunctionState>(OTHER_FUNCTION_STATE_KEY);
	if (!store) {
		throw new Error('Other Function store not found in context');
	}
	return store;
}

export function setOtherFunctionStore(
	initialData?: Tables<'other_function'>[]
): OtherFunctionState {
	const store = createOtherFunctionStore(initialData);
	setContext(OTHER_FUNCTION_STATE_KEY, store);
	return store;
}

export type { OtherFunctionState };
