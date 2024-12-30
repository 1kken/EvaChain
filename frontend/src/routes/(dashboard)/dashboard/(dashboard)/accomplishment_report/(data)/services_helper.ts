import type { Database, Tables } from '$lib/types/database.types';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

type ProfileResult = {
	data?: Tables<'profiles'> | null;
	error?: PostgrestError | null;
};

export async function fetchProfileDetails(
	id: string,
	supabase: SupabaseClient<Database>
): Promise<ProfileResult> {
	const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
	return { data, error };
}
export async function checkIfOperationalPlanExists(
	supabase: SupabaseClient<Database>,
	userProfile: Tables<'profiles'>
) {
	const year = new Date().getFullYear();

	if (!userProfile) {
		return {
			error: true,
			message: { status: 'error', text: 'User profile not found' }
		};
	}

	// Build the query based on user's profile
	let query = supabase.from('operational_plan').select('*');

	// Add conditions based on user's profile hierarchy
	if (userProfile.program_id) {
		query = query.eq('program_id', userProfile.program_id);
	} else if (userProfile.office_id) {
		query = query.eq('office_id', userProfile.office_id);
	} else if (userProfile.unit_id) {
		query = query.eq('unit_id', userProfile.unit_id);
	}

	const { data: operationalPlans, error: fetchError } = await query;

	if (fetchError) {
		return {
			error: true,
			message: { status: 'error', text: 'Error fetching operational plans' }
		};
	}

	// Filter plans from current year
	const currentYearPlans = operationalPlans?.filter(
		(plan) => new Date(plan.created_at).getFullYear() === year
	);

	if (currentYearPlans && currentYearPlans.length >= 1) {
		const scope = userProfile.program_id
			? 'program'
			: userProfile.office_id
				? 'office'
				: userProfile.unit_id
					? 'unit'
					: 'unknown';

		return {
			error: true,
			message: {
				status: 'error',
				text: `An operational plan for the year ${year} already exists at your ${scope} level.`
			}
		};
	}

	return { error: false };
}
