import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProfileWithJoins } from '../../../../app';
import type { Database } from '$lib/types/database.types';

// Define the type for the returned data
export type EmployeeNatureOfWorkData = {
	[natureType: string]: number;
};

export async function fetchEmployeeNatureOfWork(
	supabase: SupabaseClient<Database>,
	profile: ProfileWithJoins,
	hasRole: (role: string) => Promise<boolean>
): Promise<EmployeeNatureOfWorkData | null> {
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

	// Fetch employee nature of work data for the unit
	const { data, error } = await supabase.rpc('get_employee_nature_of_work', {
		p_unit_id: profile.unit_id
	});

	if (error) {
		console.error('Error fetching employee nature of work data:', error);
		return null;
	}

	// The RPC function returns a JSONB object directly
	if (!data || Object.keys(data).length === 0) {
		return {};
	}

	// Return the data directly as it's already in the correct format
	return data as EmployeeNatureOfWorkData;
}
