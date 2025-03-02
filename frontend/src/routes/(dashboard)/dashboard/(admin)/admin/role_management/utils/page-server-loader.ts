import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { updateUserRoleSchema } from './schema';

export async function fetchProfiles(supabase: SupabaseClient<Database>) {
	const { data, error: fetchError } = await supabase.from('profile_details_view').select('*');

	if (fetchError) {
		error(500, fetchError.message);
	}

	return data;
}

export async function getUpdateUserRolesForms() {
	return {
		updateForm: await superValidate(zod(updateUserRoleSchema))
	};
}
