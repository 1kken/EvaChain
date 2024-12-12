import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const SUPPORT_FUNCTION_STATE_KEY = Symbol('SUPPORT_FUNCTION_STATE_KEY');

type SupportFunctionState = {
	currentSupportFunctions: Writable<Tables<'support_function'>[]>;
	size: Writable<number>;
	addSupportFunction: (supportFunction: Tables<'support_function'>) => void;
	updateSupportFunction: (id: string, updates: Partial<Tables<'support_function'>>) => void;
	removeSupportFunction: (id: string) => void;
};

function createSupportFunctionStore(
	initialData?: Tables<'support_function'>[]
): SupportFunctionState {
	const currentSupportFunctions = writable<Tables<'support_function'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	currentSupportFunctions.subscribe((functions) => {
		size.set(functions.length);
	});

	function addSupportFunction(supportFunction: Tables<'support_function'>) {
		currentSupportFunctions.update((functions) => [...functions, supportFunction]);
	}

	function updateSupportFunction(id: string, updates: Partial<Tables<'support_function'>>) {
		currentSupportFunctions.update((functions) =>
			functions.map((func) => (func.id === id ? { ...func, ...updates } : func))
		);
	}

	function removeSupportFunction(id: string) {
		currentSupportFunctions.update((functions) => functions.filter((func) => func.id !== id));
	}

	return {
		currentSupportFunctions,
		size,
		addSupportFunction,
		updateSupportFunction,
		removeSupportFunction
	};
}

export function getSupportFunctionStore(): SupportFunctionState {
	const store = getContext<SupportFunctionState>(SUPPORT_FUNCTION_STATE_KEY);
	if (!store) {
		throw new Error('Support Function store not found in context');
	}
	return store;
}

export function setSupportFunctionStore(
	initialData?: Tables<'support_function'>[]
): SupportFunctionState {
	const store = createSupportFunctionStore(initialData);
	setContext(SUPPORT_FUNCTION_STATE_KEY, store);
	return store;
}

export type { SupportFunctionState };
