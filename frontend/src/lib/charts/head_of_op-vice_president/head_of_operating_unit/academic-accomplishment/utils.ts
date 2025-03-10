import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';
import type { ProfileWithJoins } from '../../../../../app';
import type { OfficeAccomplishmentData } from '../../state';

export async function fetchAcademicAccomplishmentPerformance(
	supabase: SupabaseClient<Database>,
	profile: ProfileWithJoins,
	hasRole: (role: string) => Promise<boolean>
): Promise<OfficeAccomplishmentData[] | null> {
	// Check if user has head_of_operating_unit role
	const isHeadOfOperatingUnit = await hasRole('head_of_operating_unit');

	// Only head_of_operating_unit role can access this data
	if (!isHeadOfOperatingUnit) {
		return null;
	}

	// Head of operating unit must have a unit_id
	if (!profile.unit_id) {
		return null;
	}

	// Fetch academic office accomplishment data for the unit
	const { data, error } = await supabase.rpc('academic_accomplishment_performance', {
		p_unit_id: profile.unit_id
	});

	if (error) {
		console.error('Error fetching academic accomplishment performance data:', error);
		return null;
	}

	// Return empty array if no data
	if (!data || data.length === 0) {
		return [];
	}

	// Return the data array
	return data as OfficeAccomplishmentData[];
}
