import type { PageServerLoad } from './$types';
import { fetchIpcrPerformanceSummary } from './components/services/employee-performance-indicator';
import {
	fetchIREGMForPastFiveYears,
	fetchIREGMPerYear
} from './components/services/supervisor-office-IREGM';
import { fetchFacultyPerformance } from './components/services/supervisor-office-performance';
import { fetchTeachingEffectiveness } from './components/services/supervisor-office-teaching-effictiveness';
import { fetchPopulationPieData } from './components/services/supervisor-piechart';

export const load = (async ({ locals: { supabase, profile, hasRole } }) => {
	if (!profile) {
		return { status: 401, redirect: '/login' };
	}

	try {
		// Fetch dashboard data using our service function
		const pieData = await fetchPopulationPieData(supabase, profile, hasRole);

		const ipcrPerformanceIndicator = await fetchIpcrPerformanceSummary(supabase, profile.id);
		const facultyPerformance = await fetchFacultyPerformance(supabase, profile, hasRole);
		const teachingEffectiveness = await fetchTeachingEffectiveness(supabase, profile, hasRole);
		const accReportCategoryAvg = await fetchIREGMPerYear(supabase, profile, hasRole);
		const accReportCategoryHistory = await fetchIREGMForPastFiveYears(supabase, profile, hasRole);

		console.log(teachingEffectiveness);

		// Ensure we handle empty or undefined values
		return {
			accReportCategoryHistory: accReportCategoryHistory || [],
			ipcrPerformanceIndicator: ipcrPerformanceIndicator || [],
			pieData: pieData || [],
			facultyPerformance: facultyPerformance || [],
			teachingEffectiveness: teachingEffectiveness || [],
			accReportCategoryAvg: accReportCategoryAvg
		};
	} catch (error) {
		console.error('Error fetching dashboard data:', error);
		return { status: 500, error: new Error('Unable to fetch dashboard') };
	}
}) satisfies PageServerLoad;
