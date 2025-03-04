import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProfileWithJoins } from '../../../../../../app';
import type { Database, Tables } from '$lib/types/database.types';

export async function fetchIREGMPerYear(
	supabase: SupabaseClient<Database>,
	profile: ProfileWithJoins,
	hasRole: (role: string, userId: string) => Promise<boolean>
): Promise<Tables<'accomplishment_report_category_avg'> | null> {
	const [isHeadOfOperatingUnit, isDean, isOfficeHead, isChair] = await Promise.all([
		hasRole('head_of_operating_unit', profile.id),
		hasRole('dean', profile.id),
		hasRole('head_of_office', profile.id),
		hasRole('program_chair', profile.id)
	]);

	// Return null if the user doesn't have any of the required roles
	if (!isHeadOfOperatingUnit && !isDean && !isOfficeHead && !isChair) {
		return null;
	}

	// Determine filters based on role
	const filters = {
		unit_id: undefined as number | undefined,
		office_id: undefined as number | undefined,
		program_id: undefined as number | undefined
	};

	if (isDean && profile.unit_id) {
		filters.unit_id = profile.unit_id;
	} else if (isOfficeHead && profile.office_id) {
		filters.office_id = profile.office_id;
	} else if (isChair && profile.program_id) {
		filters.program_id = profile.program_id;
	} else if (isHeadOfOperatingUnit && profile.unit_id) {
		filters.unit_id = profile.unit_id;
	}

	// Build query with appropriate filters
	let query = supabase.from('accomplishment_report_category_avg').select('*').limit(1);

	// Apply filters based on role
	if (filters.unit_id) {
		query = query.eq('unit_id', filters.unit_id);
	}

	if (filters.office_id) {
		query = query.eq('office_id', filters.office_id);
	}

	if (filters.program_id) {
		query = query.eq('program_id', filters.program_id);
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
