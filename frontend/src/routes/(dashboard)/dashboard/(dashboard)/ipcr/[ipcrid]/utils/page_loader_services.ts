import type { Tables } from '$lib/types/database.types';

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
