import type { Tables } from '$lib/types/database.types';

interface MetricsResponse {
	data: Tables<'accomplishment_template_metrics'>[];
	error?: string;
}

export async function fetchMetrics(id: string): Promise<MetricsResponse> {
	try {
		const response = await fetch(
			`/api/accomplishment_report_template/metrics/?accomplishment_template_program_project_id=${id}`
		);
		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch metrics');
		}

		return {
			data: result.data,
			error: undefined
		};
	} catch (error) {
		console.error('Error fetching metrics:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
