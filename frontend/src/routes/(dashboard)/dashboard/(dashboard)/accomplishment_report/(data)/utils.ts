import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

export async function getAccomplishmentReport(supabase: SupabaseClient<Database>, userId: string) {
	const { data, error } = await supabase
		.from('accomplishment_report')
		.select('*')
		.eq('owner_id', userId);

	if (error) {
		throw error;
	}

	return data;
}
