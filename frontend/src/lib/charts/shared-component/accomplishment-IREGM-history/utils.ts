import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProfileWithJoins } from '../../../../app';
import type { Database } from '$lib/types/database.types';
import type { YearlyIREGMAverage } from '../state';

export async function fetchIREGMForPastFiveYears(
	supabase: SupabaseClient<Database>,
	profile: ProfileWithJoins,
	hasRole: (role: string, userId: string) => Promise<boolean>
): Promise<YearlyIREGMAverage[] | null> {
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
	let query = supabase
		.from('accomplishment_report_category_avg')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(5); // Limit to the latest 5 years

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
		const { data, error } = await query;

		if (error) {
			console.error(`Error fetching accomplishment report data: ${error.message}`);
			return null;
		}

		// Group data by year from created_at and calculate overall grade
		const reportsByYear = data.reduce((acc, report) => {
			const reportYear = new Date(report.created_at!).getFullYear();

			// Check if we already have this year in our accumulator
			const existingYearIndex = acc.findIndex((item) => item.year === reportYear);

			// Calculate overall grade (average of the four categories)
			const instructionAvg = report.instruction_avg || 0;
			const researchAvg = report.research_avg || 0;
			const extensionAvg = report.extension_avg || 0;
			const governanceManagementAvg = report.governance_management_avg || 0;

			const overAllGrade = Number(
				((instructionAvg + researchAvg + extensionAvg + governanceManagementAvg) / 4).toFixed(2)
			);

			// If we don't have this year yet, add it
			if (existingYearIndex === -1) {
				acc.push({
					year: reportYear,
					over_all_grade: overAllGrade
				});
			}

			return acc;
		}, [] as YearlyIREGMAverage[]);

		// Sort by year in descending order
		reportsByYear.sort((a, b) => b.year - a.year);

		// Take only the latest 5 years
		return reportsByYear.slice(0, 5);
	} catch (e) {
		console.error('Unexpected error in fetchIREGMForPastFiveYears:', e);
		return null;
	}
}
