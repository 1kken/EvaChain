import type { Database, Tables } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProfileWithJoins } from '../../../../app';

export async function fetchTotalBudgetRequirement(
	supabase: SupabaseClient<Database>,
	profile: ProfileWithJoins,
	hasRole: (role: string) => Promise<boolean>
): Promise<Tables<'operational_plan_budget_summary'> | null> {
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

	// Fetch population data with the applied filters - corrected parameter order

	const query = supabase
		.from('operational_plan_budget_summary')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(1);

	if (filters.unit_id) {
		query.eq('unit_id', filters.unit_id);
	}

	if (filters.office_id) {
		query.eq('office_id', filters.office_id);
	}

	if (filters.unit_id === undefined && filters.office_id === undefined) {
		console.error('No valid role/filter combination');
		return null;
	}

	const { data, error } = await query;

	if (error) {
		console.error('Error fetching population data:', error);
		return null;
	}

	return data[0];
}
