import type { Tables } from '$lib/types/database.types';

interface OpProgramProjectResponse {
	data: Tables<'op_annual_plan'>[];
	error?: string;
}

export async function fetchOpAnnualPlans(id: string): Promise<OpProgramProjectResponse> {
	try {
		const response = await fetch(`/api/operational_plan/annual_plan?op_header_id=${id}`);
		const result: OpProgramProjectResponse = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch annual plans');
		}

		return result;
	} catch (error) {
		console.error('Error fetching annual plans:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

interface OpActivityResponse {
	data: Tables<'op_activity'>[];
	error?: string;
}
export async function fetchOpActivities(id: string): Promise<OpActivityResponse> {
	try {
		const response = await fetch(`/api/operational_plan/activity?annual_plan_id=${id}`);
		const result: OpActivityResponse = await response.json();
		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch activities');
		}

		return result;
	} catch (error) {
		console.error('Error fetching activities:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

interface OpIndicatorResponse {
	data: Tables<'op_activity_indicator'>[];
	error?: string;
}

export async function fetchOpIndicators(id: string): Promise<OpIndicatorResponse> {
	try {
		const response = await fetch(`/api/operational_plan/indicator?activity_id=${id}`);
		const result: OpIndicatorResponse = await response.json();
		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch indicators');
		}

		return result;
	} catch (error) {
		console.error('Error fetching indicators:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
