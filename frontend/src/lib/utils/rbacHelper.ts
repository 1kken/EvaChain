import type { Database } from '$lib/types/database.types';
import type { Tables } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Fetches the roles and permissions for a specific user
 */
export async function getUserRolesAndPermissions(
	supabase: SupabaseClient<Database>,
	userId: string
): Promise<{
	roles: Tables<'roles'>[];
	permissions: Tables<'permissions'>[];
}> {
	if (!userId) {
		return { roles: [], permissions: [] };
	}

	// Fetch user roles from database
	const { data: userRolesData, error: userRolesError } = await supabase
		.from('user_roles')
		.select('role_id')
		.eq('user_id', userId)
		.single();

	if (userRolesError || !userRolesData || !userRolesData.role_id) {
		return { roles: [], permissions: [] };
	}

	// Get the role details
	const { data: roleData, error: roleError } = await supabase
		.from('roles')
		.select('*')
		.eq('id', userRolesData.role_id)
		.single();

	if (roleError || !roleData) {
		return { roles: [], permissions: [] };
	}

	// Get all permissions associated with this role
	const { data: rolePermissionsData, error: rolePermissionsError } = await supabase
		.from('role_permissions')
		.select('permission_id')
		.eq('role_id', userRolesData.role_id);

	if (rolePermissionsError || !rolePermissionsData || rolePermissionsData.length === 0) {
		return { roles: [roleData], permissions: [] };
	}

	// Filter out any null permission IDs
	const permissionIds = rolePermissionsData
		.map((rp) => rp.permission_id)
		.filter((id): id is number => id !== null);

	if (permissionIds.length === 0) {
		return { roles: [roleData], permissions: [] };
	}

	// Get the detailed permission objects
	const { data: permissionsData, error: permissionsError } = await supabase
		.from('permissions')
		.select('*')
		.in('id', permissionIds);

	if (permissionsError || !permissionsData) {
		return { roles: [roleData], permissions: [] };
	}

	return {
		roles: [roleData],
		permissions: permissionsData
	};
}

/**
 * Checks if a user has a specific role
 */
export async function hasRole(
	supabase: SupabaseClient<Database>,
	userId: string,
	roleName: string
): Promise<boolean> {
	if (!userId || !roleName) return false;

	const { roles } = await getUserRolesAndPermissions(supabase, userId);
	return roles.some((role) => role.name === roleName);
}

/**
 * Checks if a user has a specific permission
 */
export async function hasPermission(
	supabase: SupabaseClient<Database>,
	userId: string,
	permissionName: string
): Promise<boolean> {
	if (!userId || !permissionName) return false;

	const { permissions } = await getUserRolesAndPermissions(supabase, userId);
	return permissions.some((permission) => permission.name === permissionName);
}

/**
 * Checks if a user is a super admin
 */
export async function isSuperAdmin(
	supabase: SupabaseClient<Database>,
	userId: string
): Promise<boolean> {
	return await hasRole(supabase, userId, 'superadmin');
}
