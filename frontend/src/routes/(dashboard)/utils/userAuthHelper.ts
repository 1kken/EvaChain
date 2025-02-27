import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';
import type { Tables } from '$lib/types/database.types';

export async function fetchUserAuthData(
	supabase: SupabaseClient<Database>,
	userId: string
): Promise<{ roles: Tables<'roles'>[]; permissions: Tables<'permissions'>[] }> {
	if (!userId) {
		throw new Error('User ID is required');
	}

	// First, get the user's role from the user_roles table
	const { data: userRolesData, error: userRolesError } = await supabase
		.from('user_roles')
		.select('role_id')
		.eq('user_id', userId)
		.single();

	if (userRolesError) {
		console.error('Error fetching user roles:', userRolesError);
		return { roles: [], permissions: [] };
	}

	if (!userRolesData || !userRolesData.role_id) {
		return { roles: [], permissions: [] };
	}

	// Get the role details
	const { data: roleData, error: roleError } = await supabase
		.from('roles')
		.select('*')
		.eq('id', userRolesData.role_id)
		.single();

	if (roleError) {
		console.error('Error fetching role details:', roleError);
		return { roles: [], permissions: [] };
	}

	// Get all permissions associated with this role through role_permissions table
	const { data: rolePermissionsData, error: rolePermissionsError } = await supabase
		.from('role_permissions')
		.select('permission_id, scope')
		.eq('role_id', userRolesData.role_id);

	if (rolePermissionsError) {
		console.error('Error fetching role permissions:', rolePermissionsError);
		return { roles: [roleData], permissions: [] };
	}

	if (!rolePermissionsData || rolePermissionsData.length === 0) {
		return { roles: [roleData], permissions: [] };
	}

	// Filter out any null permission IDs before using in the query
	const permissionIds = rolePermissionsData
		.map((rp) => rp.permission_id)
		.filter((id): id is number => id !== null);

	const { data: permissionsData, error: permissionsError } = await supabase
		.from('permissions')
		.select('*')
		.in('id', permissionIds);

	if (permissionsError) {
		console.error('Error fetching permissions details:', permissionsError);
		return { roles: [roleData], permissions: [] };
	}

	// Simply return the permission data as-is
	return {
		roles: [roleData],
		permissions: permissionsData
	};
}
