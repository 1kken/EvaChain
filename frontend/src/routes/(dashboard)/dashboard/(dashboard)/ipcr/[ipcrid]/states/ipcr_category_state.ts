import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const IPCR_FUNCTION_CATEGORY_STATE_KEY = Symbol('IPCR_FUNCTION_CATEGORY_STATE_KEY');

type IpcrFunctionCategoryState = {
	currentIpcrFunctionCategories: Writable<Tables<'ipcr_function_category'>[]>;
	size: Writable<number>;
	addIpcrFunctionCategory: (category: Tables<'ipcr_function_category'>) => void;
	updateIpcrFunctionCategory: (
		id: string,
		updates: Partial<Tables<'ipcr_function_category'>>
	) => void;
	removeIpcrFunctionCategory: (id: string) => void;
};

function createIpcrFunctionCategoryStore(
	initialData?: Tables<'ipcr_function_category'>[]
): IpcrFunctionCategoryState {
	const currentIpcrFunctionCategories = writable<Tables<'ipcr_function_category'>[]>(
		initialData || []
	);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentIpcrFunctionCategories changes
	currentIpcrFunctionCategories.subscribe((categories) => {
		size.set(categories.length);
	});

	function addIpcrFunctionCategory(category: Tables<'ipcr_function_category'>) {
		currentIpcrFunctionCategories.update((categories) => [...categories, category]);
	}

	function updateIpcrFunctionCategory(
		id: string,
		updates: Partial<Tables<'ipcr_function_category'>>
	) {
		currentIpcrFunctionCategories.update((categories) =>
			categories.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
		);
	}

	function removeIpcrFunctionCategory(id: string) {
		currentIpcrFunctionCategories.update((categories) => categories.filter((cat) => cat.id !== id));
	}

	return {
		currentIpcrFunctionCategories,
		size,
		addIpcrFunctionCategory,
		updateIpcrFunctionCategory,
		removeIpcrFunctionCategory
	};
}

export function getIpcrFunctionCategoryStore(): IpcrFunctionCategoryState {
	const store = getContext<IpcrFunctionCategoryState>(IPCR_FUNCTION_CATEGORY_STATE_KEY);
	if (!store) {
		throw new Error('IPCR Function Category store not found in context');
	}
	return store;
}

export function setIpcrFunctionCategoryStore(
	initialData?: Tables<'ipcr_function_category'>[]
): IpcrFunctionCategoryState {
	const store = createIpcrFunctionCategoryStore(initialData);
	setContext(IPCR_FUNCTION_CATEGORY_STATE_KEY, store);
	return store;
}

export type { IpcrFunctionCategoryState };
