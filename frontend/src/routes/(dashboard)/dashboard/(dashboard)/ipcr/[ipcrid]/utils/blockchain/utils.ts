import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function fetchIndicatorEvidenceById(
	supabase: SupabaseClient<Database>,
	indicatorId: string
) {
	const { data, error } = await supabase
		.from('ipcr_indicator_evidence')
		.select()
		.eq('ipcr_indicator_id', indicatorId)
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}
