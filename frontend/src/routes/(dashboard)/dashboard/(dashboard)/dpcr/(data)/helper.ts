import type { Tables } from '$lib/types/database.types';

export async function fetchAssessors(dpcrId: string): Promise<Tables<'dpcr_assessor'>[]> {
	const response = await fetch(`/api/dpcr/assessor?dpcr_id=${dpcrId}`);
	if (!response.ok) {
		throw new Error(`Failed to fetch assessors: ${response.statusText}`);
	}
	const { data } = await response.json();
	return data;
}
