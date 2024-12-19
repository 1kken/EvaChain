import type { Tables } from '$lib/types/database.types';

interface OpProgramProjectResponse {
	data: Tables<'op_program_project'>[];
	error?: string;
}

export async function fetchOpProgramProjects(id: string): Promise<OpProgramProjectResponse> {
	try {
		const response = await fetch(`/api/op_program_project?op_header_id=${id}`);
		const result: OpProgramProjectResponse = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch program projects');
		}

		return result;
	} catch (error) {
		console.error('Error fetching program projects:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

interface OpObjectiveResponse {
	data: Tables<'op_objectives'>[];
	error?: string;
}
export async function fetchOpObjectives(id: string): Promise<OpObjectiveResponse> {
	try {
		const response = await fetch(`/api/op_objective?op_program_project_id=${id}`);
		const result: OpObjectiveResponse = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch objectives');
		}

		return result;
	} catch (error) {
		console.error('Error fetching objectives:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
