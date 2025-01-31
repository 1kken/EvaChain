import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const OPCR_CATEGORY_STATE_KEY = Symbol('OPCR_CATEGORY_STATE_KEY');

type OpcrCategoryState = {
	currentOpcrCategories: Writable<Tables<'opcr_function_category'>[]>;
	size: Writable<number>;
	addOpcrCategory: (category: Tables<'opcr_function_category'>) => void;
	updateOpcrCategory: (id: string, updates: Partial<Tables<'opcr_function_category'>>) => void;
	removeOpcrCategory: (id: string) => void;
	getOpcrCategoriesByFunctionId: (functionId: string) => Tables<'opcr_function_category'>[];
};

function createOpcrCategoryStore(
	initialData?: Tables<'opcr_function_category'>[]
): OpcrCategoryState {
	const currentOpcrCategories = writable<Tables<'opcr_function_category'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	currentOpcrCategories.subscribe((categories) => {
		size.set(categories.length);
	});

	function addOpcrCategory(category: Tables<'opcr_function_category'>) {
		currentOpcrCategories.update((categories) => [...categories, category]);
	}

	function updateOpcrCategory(id: string, updates: Partial<Tables<'opcr_function_category'>>) {
		currentOpcrCategories.update((categories) =>
			categories.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
		);
	}

	function removeOpcrCategory(id: string) {
		currentOpcrCategories.update((categories) => categories.filter((cat) => cat.id !== id));
	}

	function getOpcrCategoriesByFunctionId(functionId: string): Tables<'opcr_function_category'>[] {
		let categories: Tables<'opcr_function_category'>[] = [];
		currentOpcrCategories.subscribe((cats) => {
			categories = cats.filter((cat) => cat.opcr_function_id === functionId);
		})();
		return categories;
	}

	return {
		currentOpcrCategories,
		size,
		addOpcrCategory,
		updateOpcrCategory,
		removeOpcrCategory,
		getOpcrCategoriesByFunctionId
	};
}

export function getOpcrCategoryStore(): OpcrCategoryState {
	const store = getContext<OpcrCategoryState>(OPCR_CATEGORY_STATE_KEY);
	if (!store) {
		throw new Error('OPCR Category store not found in context');
	}
	return store;
}

export function setOpcrCategoryStore(
	initialData?: Tables<'opcr_function_category'>[]
): OpcrCategoryState {
	const store = createOpcrCategoryStore(initialData);
	setContext(OPCR_CATEGORY_STATE_KEY, store);
	return store;
}

export type { OpcrCategoryState };
