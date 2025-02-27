import type { Tables } from '$lib/types/database.types';
import type { RequestEvent } from '@sveltejs/kit';

// Cache user data for performance
const userCache = new Map<
	string,
	{
		roles: Tables<'roles'>[];
		permissions: Tables<'permissions'>[];
		timestamp: number;
	}
>();

// Cache timeout in milliseconds (5 minutes)
const CACHE_TIMEOUT = 5 * 60 * 1000;

export function attachAuthHelpers(event: RequestEvent) {
	// Add auth utility functions to locals

	event.locals.getUserRolesAndPermissions = async (userId?: string) => {
		const { session, user } = await event.locals.safeGetSession();

		// Use session user ID if no specific user ID is provided
		if (!userId && session) {
			userId = session.user.id;
		}

		if (!userId) {
			return { roles: [], permissions: [] };
		}

		// Check cache first
		const cached = userCache.get(userId);
		if (cached && Date.now() - cached.timestamp < CACHE_TIMEOUT) {
			return {
				roles: cached.roles,
				permissions: cached.permissions
			};
		}

		// Fetch user roles and permissions from database
		const { data: userRolesData, error: userRolesError } = await event.locals.supabase
			.from('user_roles')
			.select('role_id')
			.eq('user_id', userId)
			.single();

		if (userRolesError || !userRolesData || !userRolesData.role_id) {
			return { roles: [], permissions: [] };
		}

		// Get the role details
		const { data: roleData, error: roleError } = await event.locals.supabase
			.from('roles')
			.select('*')
			.eq('id', userRolesData.role_id)
			.single();

		if (roleError || !roleData) {
			return { roles: [], permissions: [] };
		}

		// Get all permissions associated with this role
		const { data: rolePermissionsData, error: rolePermissionsError } = await event.locals.supabase
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
		const { data: permissionsData, error: permissionsError } = await event.locals.supabase
			.from('permissions')
			.select('*')
			.in('id', permissionIds);

		if (permissionsError || !permissionsData) {
			return { roles: [roleData], permissions: [] };
		}

		// Update cache
		userCache.set(userId, {
			roles: [roleData],
			permissions: permissionsData,
			timestamp: Date.now()
		});

		return {
			roles: [roleData],
			permissions: permissionsData
		};
	};

	// Check if user has a specific role
	event.locals.hasRole = async (roleName: string, userId?: string) => {
		const { roles } = await event.locals.getUserRolesAndPermissions(userId);
		return roles.some((role) => role.name === roleName);
	};

	// Check if user has a specific permission
	event.locals.hasPermission = async (permissionName: string, userId?: string) => {
		const { permissions } = await event.locals.getUserRolesAndPermissions(userId);
		return permissions.some((permission) => permission.name === permissionName);
	};

	// Add a convenience method for superadmin check
	event.locals.isSuperAdmin = async (userId?: string) => {
		return await event.locals.hasRole('superadmin', userId);
	};

	// Utility to clear cache for a specific user
	event.locals.clearUserCache = (userId: string) => {
		userCache.delete(userId);
	};
}

// Function to clear the entire cache (useful for testing or when roles/permissions change)
export function clearAuthCache(): void {
	userCache.clear();
}
