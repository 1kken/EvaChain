import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProfileWithJoins } from '../../../../../../app';
import type { Database } from '$lib/types/database.types';

/**
 * This function loads the operational plan id depending on the user role
 * if dean or head of office, it will load the operational plan (of the head_of_operating_unit) using unit_id id of the current year
 * if director he will use the office_id
 */
export async function fetchOperationalPlanId(
	supabase: SupabaseClient<Database>,
	profile: ProfileWithJoins,
	hasRole: (role: string, userId: string) => Promise<boolean>
) {
	const [isDean, isOfficeHead, isChair, isDirector] = await Promise.all([
		hasRole('dean', profile.id),
		hasRole('head_of_office', profile.id),
		hasRole('program_chair', profile.id),
		hasRole('director', profile.id)
	]);

	// Return null if the user doesn't have any of the required roles
	if (!isDean && !isOfficeHead && !isChair) {
		return null;
	}

	// Determine filters based on role
	const filters = {
		unit_id: undefined as number | undefined,
		office_id: undefined as number | undefined
	};

	if (isDean && profile.unit_id) {
		filters.unit_id = profile.unit_id;
	} else if (isOfficeHead && profile.unit_id) {
		filters.unit_id = profile.unit_id;
	} else if (isChair && profile.office_id) {
		filters.office_id = profile.office_id;
	}

	// Build query with appropriate filters
	// Get current year
	const currentYear = new Date().getFullYear();

	// Build query with appropriate filters
	let query = supabase
		.from('operational_plan_of_heads')
		.select('id')
		.eq('status', 'approved')
		.gte('created_at', `${currentYear}-01-01`)
		.lt('created_at', `${currentYear + 1}-01-01`)
		.limit(1);

	// Apply filters based on role
	if (filters.unit_id) {
		query = query.eq('unit_id', filters.unit_id);
	}

	if (filters.office_id) {
		query = query.eq('office_id', filters.office_id);
	}

	try {
		const { data, error } = await query.maybeSingle();

		if (error) {
			console.error(`Error fetching accomplishment report data: ${error.message}`);
			return null;
		}

		return data;
	} catch (e) {
		console.error('Unexpected error in fetchIREGMPerYear:', e);
		return null;
	}
}

/**
 * This function loads the strategic plan id depending
 */
export async function fetchStrategicPlanId(
	supabase: SupabaseClient<Database>,
	profile: ProfileWithJoins,
	hasRole: (role: string, userId: string) => Promise<boolean>
) {
	const [isHeadOfOperatingUnit, isVicePresident] = await Promise.all([
		hasRole('head_of_operating_unit', profile.id),
		hasRole('vice-president', profile.id)
	]);

	// Return null if the user doesn't have any of the required roles
	if (!isHeadOfOperatingUnit && !isVicePresident) {
		return null;
	}

	// Get current year
	const currentYear = new Date().getFullYear();

	// Build query with appropriate filters
	let query = supabase
		.from('strategic_plan')
		.select('id')
		.eq('status', 'published')
		.lte('start_year', currentYear)
		.gte('end_year', currentYear)
		.limit(1);

	try {
		const { data, error } = await query.maybeSingle();

		if (error) {
			console.error(`Error fetching accomplishment report data: ${error.message}`);
			return null;
		}

		return data;
	} catch (e) {
		console.error('Unexpected error in fetchIREGMPerYear:', e);
		return null;
	}
}
