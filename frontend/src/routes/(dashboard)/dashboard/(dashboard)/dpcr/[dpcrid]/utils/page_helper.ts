import type { Tables } from '$lib/types/database.types';

//==================UPDATE POSITION =================
export async function updateDpcrCategoryPosition(
	dpcrCategories: Tables<'dpcr_function_category'>[]
) {
	try {
		const response = await fetch(`/api/dpcr/category`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(dpcrCategories)
		});

		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to update position');
		}

		return result;
	} catch (error) {
		console.error('Error updating position:', error);
		return {
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

export async function updateDpcrIndicatorPosition(dpcrIndicators: Tables<'dpcr_indicator'>[]) {
	try {
		const response = await fetch(`/api/dpcr/indicator`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(dpcrIndicators)
		});

		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to update position');
		}

		return result;
	} catch (error) {
		console.error('Error updating position:', error);
		return {
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

//===================FETCHING!===================
interface DpcrCategoryResponse {
	data: Tables<'dpcr_function_category'>[];
	error?: string;
}

export async function fetchDpcrFunctionCategories(
	functionId: string
): Promise<DpcrCategoryResponse> {
	try {
		const response = await fetch(`/api/dpcr/category?dpcr_function_id=${functionId}`);
		const result: DpcrCategoryResponse = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch DPCR function categories');
		}

		return result;
	} catch (error) {
		console.error('Error fetching DPCR function categories:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

interface DpcrIndicatorResponse {
	data: Tables<'dpcr_indicator'>[];
	error?: string;
}

export async function fetchDpcrIndicators(
	parent: 'dpcr_function_id' | 'dpcr_function_category_id',
	id: string
): Promise<DpcrIndicatorResponse> {
	try {
		const response = await fetch(`/api/dpcr/indicator?${parent}=${id}`);
		const result: DpcrIndicatorResponse = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch DPCR indicators');
		}
		return result;
	} catch (error) {
		console.error('Error fetching DPCR indicators:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
