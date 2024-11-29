// src/lib/stores/authStore.ts
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Tables } from '$lib/types/database.types';

// Create a unique symbol for the auth context
const AUTH_KEY = Symbol('AUTH_STORE');

type AuthStore = {
	currentProfile: Writable<Tables<'profiles'> | null>;
	isAuthenticated: Writable<boolean>;
	fetchProfile: (supabase: SupabaseClient) => Promise<void>;
	setProfile: (profile: Tables<'profiles'> | null) => void;
	clearProfile: () => void;
};

function createAuthStore(): AuthStore {
	const currentProfile = writable<Tables<'profiles'> | null>(null);
	const isAuthenticated = writable(false);

	return {
		currentProfile,
		isAuthenticated,

		async fetchProfile(supabase: SupabaseClient) {
			const {
				data: { user }
			} = await supabase.auth.getUser();

			if (!user?.id) {
				currentProfile.set(null);
				isAuthenticated.set(false);
				return;
			}

			const { data: profile }: { data: Tables<'profiles'> | null } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', user.id)
				.single();

			currentProfile.set(profile);
			isAuthenticated.set(!!profile);
		},

		setProfile(profile: Tables<'profiles'> | null) {
			currentProfile.set(profile);
			isAuthenticated.set(!!profile);
		},

		clearProfile() {
			currentProfile.set(null);
			isAuthenticated.set(false);
		}
	};
}

// Function to set up the auth context
export function setAuthStore(): AuthStore {
	const auth = createAuthStore();
	setContext(AUTH_KEY, auth);
	return auth;
}

// Function to get the auth context
export function getAuthStore(): AuthStore {
	const auth = getContext<AuthStore>(AUTH_KEY);
	if (!auth) {
		throw new Error(
			'getAuthStore() called outside of component initialization or you havent intilialize it'
		);
	}
	return auth;
}

export type { AuthStore };
