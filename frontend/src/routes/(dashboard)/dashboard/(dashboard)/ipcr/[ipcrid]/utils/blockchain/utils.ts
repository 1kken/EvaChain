import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function fetchIndicatorEvidenceById(
	supabase: SupabaseClient<Database>,
	accomplsihmentId: string
) {
	const { data, error } = await supabase
		.from('ipcr_indicator_evidence')
		.select()
		.eq('ipcr_indicator_accomplishment_id', accomplsihmentId)
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}
