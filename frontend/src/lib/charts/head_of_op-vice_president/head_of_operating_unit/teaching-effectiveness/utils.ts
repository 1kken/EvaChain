import type { Database, Tables } from '$lib/types/database.types';
import type { OfficeTeachingEffectiveness } from '../../state';
import type { ProfileWithJoins } from '../../../../../app';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function fetchOfficesTeachingEffectiveness(
	supabase: SupabaseClient<Database>,
	profile: ProfileWithJoins,
	hasRole: (role: string) => Promise<boolean>
): Promise<OfficeTeachingEffectiveness[] | null> {
	const [isHeadOfOperatingUnit, isVicePresident] = await Promise.all([
		hasRole('head_of_operating_unit'),
		hasRole('vice-president')
	]);

	// Determine filters based on role
	const filters = {
		p_unit_id: undefined as number | undefined
	};

	// Vice President can see all offices across units or filter by their unit
	if (isVicePresident) {
		// Optional filtering by unit_id if available
		if (profile.unit_id) {
			filters.p_unit_id = profile.unit_id;
		}
		// If no unit_id specified, they see all units (p_unit_id remains undefined)
	}
	// Head of Operating Unit can only see offices in their unit
	else if (isHeadOfOperatingUnit && profile.unit_id) {
		filters.p_unit_id = profile.unit_id;
	}
	// If neither role applies, return null
	else {
		return null;
	}

	// Call the RPC function with the appropriate filters
	const { data, error } = await supabase.rpc('get_office_teaching_effectiveness_avg', filters);

	if (error) {
		console.error('Error fetching office teaching effectiveness:', error);
		throw error;
	}

	// Handle potential null data
	if (!data) {
		return [];
	}

	// Parse and validate the data structure
	// First cast to unknown, then to the specific type
	const typedData = data as unknown as OfficeTeachingEffectiveness[];

	// Verify the data structure matches our expected interface
	return typedData.map((item) => ({
		office_code: String(item.office_code),
		office_teaching_effectiveness_avg: Number(item.office_teaching_effectiveness_avg)
	}));
}

export async function fetchAcademicOfficesByUnit(
	supabase: SupabaseClient<Database>,
	unit_id: number | null
): Promise<Tables<'office'>[]> {
	if (!unit_id) {
		return [];
	}

	const { data, error } = await supabase
		.from('office')
		.select('*')
		.eq('unit_id', unit_id)
		.or('name.ilike.College%,name.ilike.Institute%')
		.order('name');

	if (error) {
		console.error('Error fetching offices by unit:', error);
		throw error;
	}

	return data || [];
}
