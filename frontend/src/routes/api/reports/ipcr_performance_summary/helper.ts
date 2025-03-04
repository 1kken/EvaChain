import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from '$lib/types/database.types';
import type { ProfileWithJoins } from '../../../../app';

export interface PerformanceSummaryWithOwner extends Tables<'ipcr_performance_summary'> {
	owner: {
		id: string;
		employee_id: string | null;
		first_name: string | null;
		middle_name: string | null;
		last_name: string | null;
		email: string | null;
		position: {
			name: string | null;
		} | null;
		nature_of_work: {
			type: string | null;
		} | null;
		employee_status: {
			type: string | null;
		} | null;
		unit: {
			code: string | null;
			name: string | null;
		} | null;
		office: {
			code: string | null;
			name: string | null;
		} | null;
		program: {
			name: string | null;
		} | null;
	} | null;
}

// Extended interface to include the derived properties
export interface PerformanceSummaryWithDerivedData extends PerformanceSummaryWithOwner {
	derivedYear: number;
	derivedPeriod: number;
}
// Extended interface to include the derived properties
export interface PerformanceSummaryWithDerivedData extends PerformanceSummaryWithOwner {
	derivedYear: number;
	derivedPeriod: number;
}

export async function fetchPerformanceSummary(
	supabase: SupabaseClient<Database>,
	profile: ProfileWithJoins,
	hasRole: (role: string, userId: string) => Promise<boolean>,
	year?: number,
	period?: number
): Promise<PerformanceSummaryWithDerivedData[] | null> {
	// Check user roles
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

	try {
		// First, get the performance summary data without the join
		let query = supabase.from('ipcr_performance_summary').select('*').eq('status', 'approved');

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

		// Apply date range filters based on year and period if provided
		if (year !== undefined) {
			if (period === 1) {
				// Period 1: January-June of the specified year
				const startDate = `${year}-01-01T00:00:00.000Z`;
				const endDate = `${year}-06-30T23:59:59.999Z`;
				query = query.gte('created_at', startDate).lte('created_at', endDate);
			} else if (period === 2) {
				// Period 2: July-December of the specified year
				const startDate = `${year}-07-01T00:00:00.000Z`;
				const endDate = `${year}-12-31T23:59:59.999Z`;
				query = query.gte('created_at', startDate).lte('created_at', endDate);
			} else if (period === undefined) {
				// No period specified, filter for the entire year
				const startDate = `${year}-01-01T00:00:00.000Z`;
				const endDate = `${year}-12-31T23:59:59.999Z`;
				query = query.gte('created_at', startDate).lte('created_at', endDate);
			}
		}

		// Execute the query
		const { data: summaryData, error: summaryError } = await query;

		if (summaryError) {
			console.error(`Error fetching performance summary data: ${summaryError.message}`);
			return null;
		}

		if (!summaryData || summaryData.length === 0) {
			return [];
		}

		// Extract owner IDs to fetch profile data separately
		const ownerIds = summaryData
			.map((summary) => summary.owner_id)
			.filter((id): id is string => id !== null);

		// Only proceed with profile fetch if there are owner IDs
		if (ownerIds.length === 0) {
			// Map the data to include period and year derived from created_at without owner info
			return summaryData.map((summary) => {
				const createdDate = new Date(summary.created_at!);
				const summaryYear = createdDate.getFullYear();
				const summaryMonth = createdDate.getMonth() + 1;
				const summaryPeriod = summaryMonth <= 6 ? 1 : 2;

				return {
					...summary,
					owner: null,
					derivedYear: summaryYear,
					derivedPeriod: summaryPeriod
				};
			});
		}

		// Fetch profiles data for the owners
		const { data: profilesData, error: profilesError } = await supabase
			.from('profiles')
			.select(
				`
				id,
				employee_id,
				first_name,
				middle_name,
				last_name,
				email,
				position:position_id (
					name
				),
				nature_of_work:nature_of_work_id (
					type
				),
				employee_status:employee_status_id (
					type
				),
				unit:unit_id (
					code,
					name
				),
				office:office_id (
					code,
					name
				),
				program:program_id (
					name
				)
			`
			)
			.in('id', ownerIds);

		if (profilesError) {
			console.error(`Error fetching profile data: ${profilesError.message}`);
			// Continue without profile data
			return summaryData.map((summary) => {
				const createdDate = new Date(summary.created_at!);
				const summaryYear = createdDate.getFullYear();
				const summaryMonth = createdDate.getMonth() + 1;
				const summaryPeriod = summaryMonth <= 6 ? 1 : 2;

				return {
					...summary,
					owner: null,
					derivedYear: summaryYear,
					derivedPeriod: summaryPeriod
				};
			});
		}

		// Create a lookup map for profiles by ID
		const profilesMap = new Map();
		profilesData?.forEach((profile) => {
			profilesMap.set(profile.id, profile);
		});

		// Map the data to include period and year derived from created_at
		const mappedSummaries = summaryData.map((summary) => {
			const createdDate = new Date(summary.created_at!);
			const summaryYear = createdDate.getFullYear();
			const summaryMonth = createdDate.getMonth() + 1; // 0-indexed to 1-indexed
			const summaryPeriod = summaryMonth <= 6 ? 1 : 2; // 1 for Jan-Jun, 2 for Jul-Dec

			return {
				...summary,
				owner: summary.owner_id ? profilesMap.get(summary.owner_id) || null : null,
				derivedYear: summaryYear,
				derivedPeriod: summaryPeriod
			};
		});

		return mappedSummaries;
	} catch (e) {
		console.error('Unexpected error in fetchPerformanceSummary:', e);
		return null;
	}
}
