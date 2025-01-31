import type { Tables } from '$lib/types/database.types';

//==================UPDATE POSITION =================
export async function updateOpcrCategoryPosition(
	opcrCategories: Tables<'opcr_function_category'>[]
) {
	try {
		const response = await fetch(`/api/opcr/category`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(opcrCategories)
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

export async function updateOpcrIndicatorPosition(opcrIndicators: Tables<'opcr_indicator'>[]) {
	try {
		const response = await fetch(`/api/opcr/indicator`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(opcrIndicators)
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
interface OpcrCategoryResponse {
	data: Tables<'opcr_function_category'>[];
	error?: string;
}

export async function fetchOpcrFunctionCategories(
	functionId: string
): Promise<OpcrCategoryResponse> {
	try {
		const response = await fetch(`/api/opcr/category?opcr_function_id=${functionId}`);
		const result: OpcrCategoryResponse = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch OPCR function categories');
		}

		return result;
	} catch (error) {
		console.error('Error fetching OPCR function categories:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

interface OpcrIndicatorResponse {
	data: Tables<'opcr_indicator'>[];
	error?: string;
}

export async function fetchOpcrIndicators(
	parent: 'opcr_function_id' | 'opcr_function_category_id',
	id: string
): Promise<OpcrIndicatorResponse> {
	try {
		const response = await fetch(`/api/opcr/indicator?${parent}=${id}`);
		const result: OpcrIndicatorResponse = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch OPCR indicators');
		}
		return result;
	} catch (error) {
		console.error('Error fetching OPCR indicators:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
