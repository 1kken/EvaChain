import type { Tables } from '$lib/types/database.types';

export async function fetchObjectives(planId: string): Promise<Tables<'strat_plan_objective'>[]> {
	const response = await fetch(`/api/strategic_plan/objectives?plan_id=${planId}`);
	if (!response.ok) {
		throw new Error(`Failed to fetch objectives: ${response.statusText}`);
	}
	const { data } = await response.json();
	return data;
}
