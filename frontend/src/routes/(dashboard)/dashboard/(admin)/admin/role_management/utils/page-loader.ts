import type { Tables } from '$lib/types/database.types';

interface ErrorResponse {
	data: [];
	error: string;
}

/**
 * Fetches all roles from the roles table
 * @returns Promise with roles data or error response
 */
export async function fetchRoles(): Promise<Tables<'roles'>[] | ErrorResponse> {
	try {
		const response = await fetch(`/api/role_management/roles`);
		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch roles');
		}

		return result.data;
	} catch (error) {
		console.error('Error fetching roles:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

/**
 * Fetches user roles by user ID
 * @param userId The ID of the user to fetch roles for
 * @returns Promise with user roles data or error response
 */
export async function fetchUserRoles(
	userId: string
): Promise<Tables<'user_roles'>[] | ErrorResponse> {
	try {
		const response = await fetch(`/api/role_management/user_roles?user_id=${userId}`);
		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'Failed to fetch user roles');
		}

		return result.data;
	} catch (error) {
		console.error('Error fetching user roles:', error);
		return {
			data: [],
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}
