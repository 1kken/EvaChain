import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const IPCR_FUNCTION_SUB_CATEGORY_STATE_KEY = Symbol('IPCR_FUNCTION_SUB_CATEGORY_STATE_KEY');

type IpcrFunctionSubCategoryState = {
	currentIpcrFunctionSubCategories: Writable<Tables<'ipcr_function_sub_category'>[]>;
	size: Writable<number>;
	addIpcrFunctionSubCategory: (subCategory: Tables<'ipcr_function_sub_category'>) => void;
	updateIpcrFunctionSubCategory: (
		id: string,
		updates: Partial<Tables<'ipcr_function_sub_category'>>
	) => void;
	removeIpcrFunctionSubCategory: (id: string) => void;
};

function createIpcrFunctionSubCategoryStore(
	initialData?: Tables<'ipcr_function_sub_category'>[]
): IpcrFunctionSubCategoryState {
	const currentIpcrFunctionSubCategories = writable<Tables<'ipcr_function_sub_category'>[]>(
		initialData || []
	);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentIpcrFunctionSubCategories changes
	currentIpcrFunctionSubCategories.subscribe((subCategories) => {
		size.set(subCategories.length);
	});

	function addIpcrFunctionSubCategory(subCategory: Tables<'ipcr_function_sub_category'>) {
		currentIpcrFunctionSubCategories.update((subCategories) => [...subCategories, subCategory]);
	}

	function updateIpcrFunctionSubCategory(
		id: string,
		updates: Partial<Tables<'ipcr_function_sub_category'>>
	) {
		currentIpcrFunctionSubCategories.update((subCategories) =>
			subCategories.map((subCat) => (subCat.id === id ? { ...subCat, ...updates } : subCat))
		);
	}

	function removeIpcrFunctionSubCategory(id: string) {
		currentIpcrFunctionSubCategories.update((subCategories) =>
			subCategories.filter((subCat) => subCat.id !== id)
		);
	}

	return {
		currentIpcrFunctionSubCategories,
		size,
		addIpcrFunctionSubCategory,
		updateIpcrFunctionSubCategory,
		removeIpcrFunctionSubCategory
	};
}

export function getIpcrFunctionSubCategoryStore(): IpcrFunctionSubCategoryState {
	const store = getContext<IpcrFunctionSubCategoryState>(IPCR_FUNCTION_SUB_CATEGORY_STATE_KEY);
	if (!store) {
		throw new Error('IPCR Function Sub-Category store not found in context');
	}
	return store;
}

export function setIpcrFunctionSubCategoryStore(
	initialData?: Tables<'ipcr_function_sub_category'>[]
): IpcrFunctionSubCategoryState {
	const store = createIpcrFunctionSubCategoryStore(initialData);
	setContext(IPCR_FUNCTION_SUB_CATEGORY_STATE_KEY, store);
	return store;
}

export type { IpcrFunctionSubCategoryState };
