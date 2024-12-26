import type { Tables } from '$lib/types/database.types';

//activities
interface SearchResult {
	id: string; // UUID or any unique identifier
	display: string; // Text to show in input (e.g., name)
	[key: string]: any; // For additional fields
}
export async function fetchOperationalPlanActivities(text: string): Promise<SearchResult[]> {
	try {
		const response = await fetch(`/api/operational_plan_activity?text=${encodeURIComponent(text)}`);
		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch operational plan activities');
		}

		// Assuming result.data[0].activities is an array of activities
		const activities = result.data[0]?.activities || [];

		// Map activities to SearchResult type
		const mappedActivities: SearchResult[] = activities.map((activity: any) => ({
			id: activity.activity_id, // Map to the id field
			display: activity.activity, // Map to the display field (or any other field you'd like)
			...activity // Spread the rest of the activity fields
		}));

		return mappedActivities;
	} catch (error) {
		console.error('Error fetching operational plan activities:', error);
		return [
			{
				id: '',
				display: 'Error fetching activities',
				error: error instanceof Error ? error.message : 'An unknown error occurred'
			}
		];
	}
}

//activities by id
export async function fetchOperationalPlanActivityById(id: string): Promise<SearchResult> {
	try {
		const response = await fetch(`/api/operational_plan_activity/fetch_by_id?id=${id}`);
		const result = await response.json();
		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch operational plan activity');
		}
		return {
			id: result.data.id,
			display: result.data.activity
		};
	} catch (error) {
		console.error('Error fetching operational plan activity:', error);
		return {
			id: '',
			display: 'Error fetching activity',
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
//position update
//category
export async function updateCategoryPosition(ipcrCategories: Tables<'ipcr_function_category'>[]) {
	try {
		const response = await fetch(`/api/ipcr_function_category`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(ipcrCategories)
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
//sub category
export async function updateSubCategoryPosition(
	ipcrSubCategory: Tables<'ipcr_function_sub_category'>[]
) {
	try {
		const response = await fetch(`/api/ipcr/sub_category`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(ipcrSubCategory)
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

//indicator!!!
export async function updateIndicatorPosition(ipcrIndicators: Tables<'ipcr_indicator'>[]) {
	try {
		const response = await fetch(`/api/ipcr_function_indicator`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(ipcrIndicators)
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

//*****************FETCHING ****************************/

//PROFILES!!!!!!!!!!!!!!!!!
export async function fetchProfileByname(name: string) {
	try {
		const response = await fetch(`/api/profiles/fetch_by_name?name=${name}`);
		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch profile');
		}

		return result.results;
	} catch (error) {
		console.error('Error fetching profile:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

export async function fetchProfileById(id: string) {
	try {
		const response = await fetch(`/api/profiles/fetch_by_id?id=${id}`);
		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch profile');
		}

		return result.data;
	} catch (error) {
		console.error('Error fetching profile:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
//CATEGORY!!!!
interface IpcrFunctionCategoryResponse {
	data: Tables<'ipcr_function_category'>[];
	error?: string;
}

export async function fetchIpcrFunctionCategories(
	id: string
): Promise<IpcrFunctionCategoryResponse> {
	try {
		const response = await fetch(`/api/ipcr_function_category?ipcr_function_id=${id}`);
		const result: IpcrFunctionCategoryResponse = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch ipcr categories');
		}

		return result;
	} catch (error) {
		console.error('Error fetching ipcr categories:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
//SUB-CATEGORY!!!!
interface IpcrFunctionSubCategoryResponse {
	data: Tables<'ipcr_function_sub_category'>[];
	error?: string;
}

export async function fetchIpcrFunctionSubCategories(
	id: string
): Promise<IpcrFunctionSubCategoryResponse> {
	try {
		const response = await fetch(`/api/ipcr/sub_category?ipcr_category_id=${id}`);
		const result: IpcrFunctionSubCategoryResponse = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch ipcr categories');
		}

		return result;
	} catch (error) {
		console.error('Error fetching ipcr categories:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
//INDICATOR!!!!
interface IpcrIndicatorResponse {
	data: Tables<'ipcr_indicator'>[];
	error?: string;
}

export async function fetchIpcrFunctionIndicators(
	parent: string,
	id: string
): Promise<IpcrIndicatorResponse> {
	try {
		const response = await fetch(`/api/ipcr_function_indicator?${parent}=${id}`);
		const result: IpcrIndicatorResponse = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch ipcr indicators');
		}
		return result;
	} catch (error) {
		console.error('Error fetching ipcr indicators:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
