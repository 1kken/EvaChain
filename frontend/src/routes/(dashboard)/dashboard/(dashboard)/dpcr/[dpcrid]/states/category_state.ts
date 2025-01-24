import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const DPCR_CATEGORY_STATE_KEY = Symbol('DPCR_CATEGORY_STATE_KEY');

type DpcrCategoryState = {
	currentDpcrCategories: Writable<Tables<'dpcr_function_category'>[]>;
	size: Writable<number>;
	addDpcrCategory: (category: Tables<'dpcr_function_category'>) => void;
	updateDpcrCategory: (id: string, updates: Partial<Tables<'dpcr_function_category'>>) => void;
	removeDpcrCategory: (id: string) => void;
	getDpcrCategoriesByFunctionId: (functionId: string) => Tables<'dpcr_function_category'>[];
};

function createDpcrCategoryStore(
	initialData?: Tables<'dpcr_function_category'>[]
): DpcrCategoryState {
	const currentDpcrCategories = writable<Tables<'dpcr_function_category'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	currentDpcrCategories.subscribe((categories) => {
		size.set(categories.length);
	});

	function addDpcrCategory(category: Tables<'dpcr_function_category'>) {
		currentDpcrCategories.update((categories) => [...categories, category]);
	}

	function updateDpcrCategory(id: string, updates: Partial<Tables<'dpcr_function_category'>>) {
		currentDpcrCategories.update((categories) =>
			categories.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
		);
	}

	function removeDpcrCategory(id: string) {
		currentDpcrCategories.update((categories) => categories.filter((cat) => cat.id !== id));
	}

	function getDpcrCategoriesByFunctionId(functionId: string): Tables<'dpcr_function_category'>[] {
		let categories: Tables<'dpcr_function_category'>[] = [];
		currentDpcrCategories.subscribe((cats) => {
			categories = cats.filter((cat) => cat.dpcr_function_id === functionId);
		})();
		return categories;
	}

	return {
		currentDpcrCategories,
		size,
		addDpcrCategory,
		updateDpcrCategory,
		removeDpcrCategory,
		getDpcrCategoriesByFunctionId
	};
}

export function getDpcrCategoryStore(): DpcrCategoryState {
	const store = getContext<DpcrCategoryState>(DPCR_CATEGORY_STATE_KEY);
	if (!store) {
		throw new Error('DPCR Category store not found in context');
	}
	return store;
}

export function setDpcrCategoryStore(
	initialData?: Tables<'dpcr_function_category'>[]
): DpcrCategoryState {
	const store = createDpcrCategoryStore(initialData);
	setContext(DPCR_CATEGORY_STATE_KEY, store);
	return store;
}

export type { DpcrCategoryState };
