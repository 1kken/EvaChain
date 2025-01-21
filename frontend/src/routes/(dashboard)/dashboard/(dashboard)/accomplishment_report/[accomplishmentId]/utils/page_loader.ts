import type { Tables } from '$lib/types/database.types';

interface AnnualPlanResponse {
	data: Tables<'accomplishment_annual_plan'>[];
	error?: string;
}

export async function fetchAnnualPlan(id: string): Promise<AnnualPlanResponse> {
	try {
		const response = await fetch(
			`/api/accomplishment_report/annual_plan/?accomplishment_header_id=${id}`
		);
		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch annual plan');
		}

		return {
			data: result.data,
			error: undefined
		};
	} catch (error) {
		console.error('Error fetching annual plan:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

interface ActivityResponse {
	data: Tables<'accomplishment_activity'>[];
	error?: string;
}

export async function fetchActivity(id: string): Promise<ActivityResponse> {
	try {
		const response = await fetch(
			`/api/accomplishment_report/activity/?accomplishment_annual_plan_id=${id}`
		);
		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch activity');
		}

		return {
			data: result.data,
			error: undefined
		};
	} catch (error) {
		console.error('Error fetching activity:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
