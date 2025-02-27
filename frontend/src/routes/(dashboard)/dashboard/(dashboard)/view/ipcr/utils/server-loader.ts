import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

// Fetch offices from a unit
export async function fetchOffices(unitId: number, supabase: SupabaseClient<Database>) {
	if (!unitId) return [];

	const { data, error } = await supabase
		.from('office')
		.select('*')
		.eq('unit_id', unitId)
		.order('name');

	if (error) {
		console.error('Error fetching offices:', error);
		return [];
	}

	return data || [];
}
