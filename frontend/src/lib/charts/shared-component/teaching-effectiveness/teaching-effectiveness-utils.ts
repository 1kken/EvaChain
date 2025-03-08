import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function fetchTeachingEffectivenessIndividual(
	supabase: SupabaseClient<Database>,
	userId: string
) {
	const { data, error } = await supabase
		.from('ipcr_teaching_effectiveness_avg')
		.select('*')
		.eq('owner_id', userId)
		.eq('status', 'approved')
		.order('created_at', { ascending: false })
		.limit(6);

	if (error) throw error;

	return data;
}
