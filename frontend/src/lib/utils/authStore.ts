// src/lib/stores/authStore.ts
import { writable, derived } from 'svelte/store';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Tables } from '$lib/types/database.types';

export const currentProfile = writable<Tables<'profiles'> | null>(null);
export const isAuthenticated = writable(false);

export const authStore = {
	// Function to fetch and update profile
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

	setProfile: (profile: Tables<'profiles'> | null) => {
		currentProfile.set(profile);
		isAuthenticated.set(!!profile);
	},

	clearProfile: () => {
		currentProfile.set(null);
		isAuthenticated.set(false);
	}
};
