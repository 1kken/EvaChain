import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProfileWithJoins } from '../../../../../../app';

interface TeachingEffectivenessSummary {
	average: number;
	year: number;
	period: number;
}

export async function fetchTeachingEffectiveness(
	supabase: SupabaseClient<Database>,
	profile: ProfileWithJoins,
	hasRole: (role: string, userId: string) => Promise<boolean>
): Promise<TeachingEffectivenessSummary[]> {
	try {
		// Check roles
		const [isHeadOfOperatingUnit, isDean, isOfficeHead, isChair] = await Promise.all([
			hasRole('head_of_operating_unit', profile.id),
			hasRole('dean', profile.id),
			hasRole('head_of_office', profile.id),
			hasRole('program_chair', profile.id)
		]);

		// Return empty data if the user doesn't have any of the required roles
		if (!isHeadOfOperatingUnit && !isDean && !isOfficeHead && !isChair) {
			return [];
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
			.from('ipcr_teaching_effectiveness_avg')
			.select(
				`
        id,
        teaching_effectiveness_avg,
        created_at,
        unit_id,
        office_id,
        program_id,
        owner_id
      `
			)
			.not('teaching_effectiveness_avg', 'is', null)
			.gt('teaching_effectiveness_avg', 0); // Ensure we only get records with actual ratings

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

		const { data, error } = await query;

		if (error) {
			throw new Error(`Error fetching teaching effectiveness data: ${error.message}`);
		}

		// Process the data to group by year and period
		const resultMap = new Map<
			string,
			{
				totalAverage: number;
				count: number;
				year: number;
				period: number;
			}
		>();

		data.forEach((item) => {
			if (!item.teaching_effectiveness_avg || !item.created_at) return;

			const date = new Date(item.created_at);
			const year = date.getFullYear();

			// Determine period (1 for Jan-Jun, 2 for Jul-Dec)
			const month = date.getMonth() + 1; // 0-based, so +1
			const period = month <= 6 ? 1 : 2;

			const key = `${year}-${period}`;

			if (!resultMap.has(key)) {
				resultMap.set(key, {
					totalAverage: 0,
					count: 0,
					year,
					period
				});
			}

			const entry = resultMap.get(key)!;
			entry.totalAverage += item.teaching_effectiveness_avg;
			entry.count += 1;
		});

		// Convert map to array and calculate averages
		const results: TeachingEffectivenessSummary[] = Array.from(resultMap.values())
			.map(({ totalAverage, count, year, period }) => ({
				average: count > 0 ? Number((totalAverage / count).toFixed(2)) : 0,
				year,
				period
			}))
			.sort((a, b) => {
				// Sort by year (descending) and then by period (ascending)
				if (a.year !== b.year) return b.year - a.year;
				return a.period - b.period;
			});

		return results;
	} catch (error) {
		console.error('Error in fetchTeachingEffectiveness:', error);
		throw error;
	}
}
