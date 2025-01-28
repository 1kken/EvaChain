import type { Tables } from '$lib/types/database.types';

interface StrategyPlanPerformanceIndicatorResponse {
	data: Tables<'strategy_plan_performance_indicator'>[];
	error?: string;
}

export async function fetchPerformanceIndicator(
	id: string
): Promise<StrategyPlanPerformanceIndicatorResponse> {
	try {
		const response = await fetch(
			`/api/strategic_plan/performance_indicator?strategy_plan_id=${id}`
		);
		const result: StrategyPlanPerformanceIndicatorResponse = await response.json();

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

export async function fetchStratPlanObjectives(id: string) {
	try {
		const response = await fetch(`/api/strategic_plan/objectives?plan_id=${id}`);
		const result = await response.json();
		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch strategic plan objectives');
		}
		return result;
	} catch (error) {
		console.error('Error fetching strategic plan objectives:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
