import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const USER_AUTH_STORE_KEY = Symbol('USER_AUTH_STORE_KEY');

export type UserAuthState = {
	roles: Writable<Tables<'roles'>[]>;
	permissions: Writable<Tables<'permissions'>[]>;
	setRoles: (roles: Tables<'roles'>[]) => void;
	setPermissions: (permissions: Tables<'permissions'>[]) => void;
	hasRole: (roleName: string) => boolean;
	hasPermission: (permissionName: string) => boolean;
	clearAuth: () => void;
};

function createUserAuthStore(
	initialRoles: Tables<'roles'>[] = [],
	initialPermissions: Tables<'permissions'>[] = []
): UserAuthState {
	const roles = writable<Tables<'roles'>[]>(initialRoles);
	const permissions = writable<Tables<'permissions'>[]>(initialPermissions);

	let currentRoles: Tables<'roles'>[] = initialRoles;
	let currentPermissions: Tables<'permissions'>[] = initialPermissions;

	roles.subscribe((value) => {
		currentRoles = value;
	});

	permissions.subscribe((value) => {
		currentPermissions = value;
	});

	function setRoles(newRoles: Tables<'roles'>[]) {
		roles.set(newRoles);
	}

	function setPermissions(newPermissions: Tables<'permissions'>[]) {
		permissions.set(newPermissions);
	}

	function hasRole(roleName: string): boolean {
		return currentRoles.some((role) => role.name === roleName);
	}

	function hasPermission(permissionName: string): boolean {
		return currentPermissions.some((permission) => permission.name === permissionName);
	}

	function clearAuth() {
		roles.set([]);
		permissions.set([]);
	}

	return {
		roles,
		permissions,
		setRoles,
		setPermissions,
		hasRole,
		hasPermission,
		clearAuth
	};
}

export function getUserAuthStore(): UserAuthState {
	const store = getContext<UserAuthState>(USER_AUTH_STORE_KEY);
	if (!store) {
		throw new Error('User authentication store not found in context');
	}
	return store;
}

export function setUserAuthStore(
	initialRoles: Tables<'roles'>[] = [],
	initialPermissions: Tables<'permissions'>[] = []
): UserAuthState {
	const store = createUserAuthStore(initialRoles, initialPermissions);
	setContext(USER_AUTH_STORE_KEY, store);
	return store;
}
