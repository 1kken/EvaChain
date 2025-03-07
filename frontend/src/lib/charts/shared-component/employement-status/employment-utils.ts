import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProfileWithJoins } from '../../../../app';

// Define the type for the returned data
export type EmployeeStatusData = {
	[statusType: string]: number;
};

export async function fetchEmployeeStatus(
	supabase: SupabaseClient<Database>,
	profile: ProfileWithJoins,
	hasRole: (role: string) => Promise<boolean>
): Promise<EmployeeStatusData | null> {
	const [
		isPresident,
		isHeadOfOperatingUnit,
		isDean,
		isVicePresident,
		isDirector,
		isOfficeHead,
		isChair,
		isFaculty,
		isStaff
	] = await Promise.all([
		hasRole('president'),
		hasRole('head_of_operating_unit'),
		hasRole('dean'),
		hasRole('vice-president'),
		hasRole('director'),
		hasRole('head_of_office'),
		hasRole('program_chair'),
		hasRole('faculty'),
		hasRole('staff')
	]);

	// Determine filters based on role
	const filters = {
		unit_id: undefined as number | undefined,
		office_id: undefined as number | undefined
	};

	// President has access to all data
	if (isPresident) {
		// No filters needed - will get all profiles
	}
	// Head of operating unit filters by unit_id
	else if (isHeadOfOperatingUnit && profile.unit_id) {
		filters.unit_id = profile.unit_id;
	}
	// Other roles filter by office_id
	else if (
		(isDean || isVicePresident || isDirector || isOfficeHead || isChair || isFaculty || isStaff) &&
		profile.office_id
	) {
		filters.office_id = profile.office_id;
	}
	// If no valid role/filter combination, return null
	else {
		return null;
	}

	// Fetch employee status data with the applied filters
	const { data, error } = await supabase.rpc('get_employee_status_count', {
		p_unit_id: filters.unit_id,
		p_office_id: filters.office_id
	});

	if (error) {
		console.error('Error fetching employee status data:', error);
		return null;
	}

	// The RPC function returns a JSONB object directly, no need to parse
	if (!data || Object.keys(data).length === 0) {
		return {};
	}

	// Return the data directly as it's already in the correct format
	return data as EmployeeStatusData;
}
