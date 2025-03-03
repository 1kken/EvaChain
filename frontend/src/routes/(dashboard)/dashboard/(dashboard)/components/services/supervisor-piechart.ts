import type { ProfileWithJoins } from '../../../../../../app';
import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

// Define common type for chart data
export interface ChartDataItem {
	label: string;
	count: number;
	color: string;
}

// Define return type for combined dashboard data with breakdowns
export interface EnhancedDashboardData {
	// Generalized data (same as before)
	academicRanks: ChartDataItem[];
	employeeStatus: ChartDataItem[];

	// Detailed breakdown objects by category
	breakdownAcademicRanks: Record<
		string,
		{ color: string; items: { label: string; count: number }[] }
	>;
	breakdownEmploymentStatus: Record<
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

// Employee status definitions with colors
const EMPLOYEE_STATUS: Record<string, string> = {
	Permanent: '#228B22', // Forest Green
	Temporary: '#FF8C00', // Dark Orange
	Contractual: '#4682B4' // Steel Blue
};

// Employment status subtypes for breakdown
const EMPLOYMENT_STATUS_SUBTYPES: Record<string, string[]> = {
	Permanent: ['Permanent - Full-time', 'Permanent - Part-time'],
	Temporary: ['Temporary - Full-time', 'Temporary - Part-time'],
	Contractual: ['Contractual - Short-term', 'Contractual - Long-term']
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
 * Fetches employee status data
 */
export async function fetchEmployeeStatus(
	supabase: SupabaseClient<Database>,
	filters: {
		unit_id?: number;
		office_id?: number;
		program_id?: number;
	}
): Promise<ChartDataItem[]> {
	// Build query with proper filters
	let query = supabase.from('profiles').select(`
    employee_status:employee_status_id (
      type
    )
  `);

	// Apply filters if present
	if (filters.unit_id) query = query.eq('unit_id', filters.unit_id);
	if (filters.office_id) query = query.eq('office_id', filters.office_id);
	if (filters.program_id) query = query.eq('program_id', filters.program_id);

	const { data, error } = await query;
	if (error) throw error;

	// Count employee status types
	const statusCounts: Record<string, number> = {};

	data?.forEach((item) => {
		if (item.employee_status?.type) {
			const statusType = item.employee_status.type;
			statusCounts[statusType] = (statusCounts[statusType] || 0) + 1;
		}
	});

	// Build result array with all status types (including zero counts)
	const result: ChartDataItem[] = [];

	Object.entries(EMPLOYEE_STATUS).forEach(([status, color]) => {
		result.push({
			label: status,
			count: statusCounts[status] || 0,
			color
		});
	});

	// Sort alphabetically as there's no specific order for status
	return result.sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Fetches detailed employment status breakdown
 * Note: This is a placeholder function. In a real implementation,
 * you would need to update your database schema to store this additional information.
 */
export async function fetchEmploymentStatusBreakdown(
	supabase: SupabaseClient<Database>,
	filters: {
		unit_id?: number;
		office_id?: number;
		program_id?: number;
	}
): Promise<Record<string, { color: string; items: { label: string; count: number }[] }>> {
	// Get the basic status data first
	const basicStatusData = await fetchEmployeeStatus(supabase, filters);

	// Create a more detailed breakdown
	const result: Record<string, { color: string; items: { label: string; count: number }[] }> = {};

	// Process each status type
	basicStatusData.forEach((status) => {
		const statusType = status.label;
		const color = status.color;
		const count = status.count;

		if (!result[statusType]) {
			result[statusType] = {
				color,
				items: []
			};
		}

		// If no data, just provide empty items
		if (count === 0) {
			if (EMPLOYMENT_STATUS_SUBTYPES[statusType]) {
				EMPLOYMENT_STATUS_SUBTYPES[statusType].forEach((subtype) => {
					result[statusType].items.push({
						label: subtype,
						count: 0
					});
				});
			}
			return;
		}

		// Generate simulated subtypes based on the status
		if (statusType === 'Permanent') {
			// Split Permanent between Full-time and Part-time (70/30 split for example)
			const fullTimeCount = Math.ceil(count * 0.7);
			const partTimeCount = count - fullTimeCount;

			result[statusType].items = [
				{ label: 'Permanent - Full-time', count: fullTimeCount },
				{ label: 'Permanent - Part-time', count: partTimeCount }
			];
		} else if (statusType === 'Temporary') {
			// Split Temporary between Full-time and Part-time (50/50 split for example)
			const fullTimeCount = Math.ceil(count * 0.5);
			const partTimeCount = count - fullTimeCount;

			result[statusType].items = [
				{ label: 'Temporary - Full-time', count: fullTimeCount },
				{ label: 'Temporary - Part-time', count: partTimeCount }
			];
		} else if (statusType === 'Contractual') {
			// Split Contractual between Short-term and Long-term (60/40 split for example)
			const shortTermCount = Math.ceil(count * 0.6);
			const longTermCount = count - shortTermCount;

			result[statusType].items = [
				{ label: 'Contractual - Short-term', count: shortTermCount },
				{ label: 'Contractual - Long-term', count: longTermCount }
			];
		} else {
			// For any other status types not explicitly handled
			result[statusType].items = [{ label: statusType, count: count }];
		}
	});

	return result;
}

/**
 * Main function to fetch all dashboard data based on role and profile
 */
export async function fetchPopulationPieData(
	supabase: SupabaseClient<Database>,
	profile: ProfileWithJoins,
	hasRole: (role: string, userId: string) => Promise<boolean>
): Promise<EnhancedDashboardData> {
	const [isHeadOfOperatingUnit, isDean, isOfficeHead, isChair] = await Promise.all([
		hasRole('head_of_operating_unit', profile.id),
		hasRole('dean', profile.id),
		hasRole('head_of_office', profile.id),
		hasRole('program_chair', profile.id)
	]);

	// Return empty data if the user doesn't have any of the required roles
	if (!isHeadOfOperatingUnit && !isDean && !isOfficeHead && !isChair) {
		return {
			academicRanks: [],
			employeeStatus: [],
			breakdownAcademicRanks: {},
			breakdownEmploymentStatus: {}
		};
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

	// Fetch all datasets in parallel
	const [academicRanks, employeeStatus, breakdownAcademicRanks, breakdownEmploymentStatus] =
		await Promise.all([
			fetchAcademicRanks(supabase, filters),
			fetchEmployeeStatus(supabase, filters),
			fetchAcademicPositionsBreakdown(supabase, filters),
			fetchEmploymentStatusBreakdown(supabase, filters)
		]);

	return {
		academicRanks,
		employeeStatus,
		breakdownAcademicRanks,
		breakdownEmploymentStatus
	};
}
