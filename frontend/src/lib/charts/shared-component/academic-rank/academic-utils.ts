import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProfileWithJoins } from '../../../../app';

// Define common type for chart data
export interface ChartDataItem {
	label: string;
	count: number;
	color: string;
}

// Define return type for combined dashboard data with breakdowns
export interface EnhancedDashboardData {
	// Only academic ranks data
	academicRanks: ChartDataItem[];

	// Only academic ranks breakdown
	breakdownAcademicRanks: Record<
		string,
		{ color: string; items: { label: string; count: number }[] }
	>;
}

// Position category definitions with colors
const POSITION_CATEGORIES: Record<string, { color: string; positions: string[] }> = {
	Professor: {
		color: '#4169E1',
		positions: [
			'Professor-I',
			'Professor-II',
			'Professor-III',
			'Professor-IV',
			'Professor-V',
			'Professor-VI'
		]
	},
	'Associate Professor': {
		color: '#3CB371',
		positions: [
			'Associate Professor-I',
			'Associate Professor-II',
			'Associate Professor-III',
			'Associate Professor-IV',
			'Associate Professor-V'
		]
	},
	'Assistant Professor': {
		color: '#FFA500',
		positions: [
			'Assistant Professor-I',
			'Assistant Professor-II',
			'Assistant Professor-III',
			'Assistant Professor-IV'
		]
	},
	Instructor: {
		color: '#9370DB',
		positions: ['Instructor-I', 'Instructor-II', 'Instructor-III']
	},
	'Non-Teaching': {
		color: '#20B2AA',
		positions: [
			'Administrative Assistant',
			'Records Officer',
			'Library Assistant',
			'Laboratory Technician'
		]
	}
};

/**
 * Creates a position name to category mapping
 */
function createPositionCategoryMap(): Record<string, string> {
	const map: Record<string, string> = {};
	Object.entries(POSITION_CATEGORIES).forEach(([category, { positions }]) => {
		positions.forEach((position) => {
			map[position] = category;
		});
	});
	return map;
}

/**
 * Fetches generalized academic rank data
 */
export async function fetchAcademicRanks(
	supabase: SupabaseClient<Database>,
	filters: {
		unit_id?: number;
		office_id?: number;
		program_id?: number;
	}
): Promise<ChartDataItem[]> {
	// Create position to category mapping
	const positionToCategoryMap = createPositionCategoryMap();

	// Build query with proper filters
	let query = supabase.from('profiles').select(`
    position:position_id (
      name
    )
  `);

	// Apply filters if present
	if (filters.unit_id) query = query.eq('unit_id', filters.unit_id);
	if (filters.office_id) query = query.eq('office_id', filters.office_id);
	if (filters.program_id) query = query.eq('program_id', filters.program_id);

	const { data, error } = await query;
	if (error) throw error;

	// Count positions by category
	const categoryCounts: Record<string, number> = {};

	data?.forEach((item) => {
		if (item.position?.name) {
			const positionName = item.position.name;
			const category = positionToCategoryMap[positionName] || 'Other';
			categoryCounts[category] = (categoryCounts[category] || 0) + 1;
		}
	});

	// Build result array with all categories (including zero counts)
	const result: ChartDataItem[] = [];

	Object.entries(POSITION_CATEGORIES).forEach(([category, { color }]) => {
		result.push({
			label: category,
			count: categoryCounts[category] || 0,
			color
		});
	});

	// Sort in predefined order
	const categoryOrder = [
		'Professor',
		'Associate Professor',
		'Assistant Professor',
		'Instructor',
		'Non-Teaching'
	];
	return result.sort((a, b) => {
		return categoryOrder.indexOf(a.label) - categoryOrder.indexOf(b.label);
	});
}

/**
 * Fetches detailed academic position breakdown grouped by category
 */
export async function fetchAcademicPositionsBreakdown(
	supabase: SupabaseClient<Database>,
	filters: {
		unit_id?: number;
		office_id?: number;
		program_id?: number;
	}
): Promise<Record<string, { color: string; items: { label: string; count: number }[] }>> {
	// Create position to category mapping
	const positionToCategoryMap = createPositionCategoryMap();

	// Build query with proper filters
	let query = supabase.from('profiles').select(`
    position:position_id (
      name
    )
  `);

	// Apply filters if present
	if (filters.unit_id) query = query.eq('unit_id', filters.unit_id);
	if (filters.office_id) query = query.eq('office_id', filters.office_id);
	if (filters.program_id) query = query.eq('program_id', filters.program_id);

	const { data, error } = await query;
	if (error) throw error;

	// Count positions individually
	const positionCounts: Record<string, number> = {};

	data?.forEach((item) => {
		if (item.position?.name) {
			const positionName = item.position.name;
			positionCounts[positionName] = (positionCounts[positionName] || 0) + 1;
		}
	});

	// Group by category
	const result: Record<string, { color: string; items: { label: string; count: number }[] }> = {};

	// Initialize result with all categories from POSITION_CATEGORIES
	Object.entries(POSITION_CATEGORIES).forEach(([category, { color, positions }]) => {
		result[category] = {
			color,
			items: positions.map((position) => ({
				label: position,
				count: positionCounts[position] || 0
			}))
		};

		// Sort items by position level
		result[category].items.sort((a, b) => {
			// Extract level (roman numeral or name part)
			const levelA = a.label.split('-')[1] || a.label;
			const levelB = b.label.split('-')[1] || b.label;

			// If both have roman numerals, convert to numbers for comparison
			if (levelA && levelB && levelA.match(/^[IVX]+$/) && levelB.match(/^[IVX]+$/)) {
				const numA = levelA.replace('I', '1').replace('V', '5').replace('X', '10');
				const numB = levelB.replace('I', '1').replace('V', '5').replace('X', '10');
				return parseInt(numA) - parseInt(numB);
			}

			// Otherwise sort alphabetically
			return levelA.localeCompare(levelB);
		});
	});

	// Add any positions that weren't in our predefined categories
	Object.entries(positionCounts).forEach(([position, count]) => {
		if (!positionToCategoryMap[position]) {
			if (!result['Other']) {
				result['Other'] = {
					color: '#CCCCCC',
					items: []
				};
			}

			result['Other'].items.push({
				label: position,
				count
			});
		}
	});

	return result;
}

/**
 * Main function to fetch all dashboard data based on role and profile
 */
export async function fetchAcademicRanksData(
	supabase: SupabaseClient<Database>,
	profile: ProfileWithJoins,
	hasRole: (role: string) => Promise<boolean>
): Promise<EnhancedDashboardData> {
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
		office_id: undefined as number | undefined,
		program_id: undefined as number | undefined
	};

	// President has access to all data
	if (isPresident) {
		// No filters needed - will get all profiles
	}
	// Head of operating unit filters by unit_id
	else if (isHeadOfOperatingUnit && profile.unit_id) {
		filters.unit_id = profile.unit_id;
	}
	// Dean filters by unit_id
	else if (isDean && profile.unit_id) {
		filters.unit_id = profile.unit_id;
	}
	// Vice President and Director filter by their office
	else if ((isVicePresident || isDirector) && profile.office_id) {
		filters.office_id = profile.office_id;
	}
	// Office Head filters by office_id
	else if (isOfficeHead && profile.office_id) {
		filters.office_id = profile.office_id;
	}
	// Program Chair filters by program_id
	else if (isChair && profile.program_id) {
		filters.program_id = profile.program_id;
	}
	// Faculty and Staff filter by their office
	else if ((isFaculty || isStaff) && profile.office_id) {
		filters.office_id = profile.office_id;
	}
	// If no valid role/filter combination, return empty data
	else {
		return {
			academicRanks: [],
			breakdownAcademicRanks: {}
		};
	}

	console.log('filters', filters);

	// Fetch academic ranks datasets in parallel
	const [academicRanks, breakdownAcademicRanks] = await Promise.all([
		fetchAcademicRanks(supabase, filters),
		fetchAcademicPositionsBreakdown(supabase, filters)
	]);

	return {
		academicRanks,
		breakdownAcademicRanks
	};
}
