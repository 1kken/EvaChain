import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function fetchDpcrPerformanceSummary(
	supabase: SupabaseClient<Database>,
	userId: string
) {
	const { data, error } = await supabase
		.from('dpcr_performance_summary')
		.select('*')
		.eq('owner_id', userId)
		.eq('status', 'approved')
		.order('created_at', { ascending: true })
		.limit(6);

	if (error) throw error;

	return data;
}
