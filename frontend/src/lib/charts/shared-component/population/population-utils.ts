import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProfileWithJoins } from '../../../../app';

interface PopulationData {
	titleName: string;
	population: number;
	malePopulation: number;
	femalePopulation: number;
}

export async function fetchPopulationData(
	supabase: SupabaseClient<Database>,
	profile: ProfileWithJoins,
	hasRole: (role: string) => Promise<boolean>
): Promise<PopulationData | null> {
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

	// Fetch title name based on filters
	let titleName = 'All Offices'; // Default for president

	if (filters.unit_id) {
		// Fetch unit code
		const { data: unitData, error: unitError } = await supabase
			.from('unit')
			.select('code')
			.eq('id', filters.unit_id)
			.single();

		if (unitError) {
			console.error('Error fetching unit code:', unitError);
		} else if (unitData) {
			titleName = unitData.code;
		}
	} else if (filters.office_id) {
		// Fetch office code
		const { data: officeData, error: officeError } = await supabase
			.from('office')
			.select('code')
			.eq('id', filters.office_id)
			.single();

		if (officeError) {
			console.error('Error fetching office code:', officeError);
		} else if (officeData) {
			titleName = officeData.code;
		}
	}

	// Fetch population data with the applied filters - corrected parameter order
	const { data, error } = await supabase.rpc('get_population_stats', {
		filter_unit_id: filters.unit_id,
		filter_office_id: filters.office_id
	});

	if (error) {
		console.error('Error fetching population data:', error);
		return null;
	}

	if (!data || data.length === 0) {
		return {
			titleName,
			population: 0,
			malePopulation: 0,
			femalePopulation: 0
		};
	}

	return {
		titleName,
		population: data[0].total_population,
		malePopulation: data[0].male_population,
		femalePopulation: data[0].female_population
	};
}
