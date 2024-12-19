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

export async function checkIfOperationalPlanExists(supabase: SupabaseClient<Database>) {
	const year = new Date().getFullYear();
	const { data: operationalPlans, error: fetchError } = await supabase
		.from('operational_plan')
		.select('*');

	if (fetchError) {
		return {
			error: true,
			message: { status: 'error', text: `Error fetching Operational plans` }
		};
	}

	// Filter plans from current year
	const currentYearPlans = operationalPlans?.filter(
		(plan) => new Date(plan.created_at).getFullYear() === year
	);

	if (currentYearPlans && currentYearPlans.length >= 1) {
		return {
			error: true,
			message: {
				status: 'error',
				text: `An operational plan for the year ${year} already exists.`
			}
		};
	}

	return { error: false };
}
