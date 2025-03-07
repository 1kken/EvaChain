import { fetchAcademicRanksData } from '$lib/charts/shared-component/academic-rank/academic-utils';
import { fetchEmployeeStatus } from '$lib/charts/shared-component/employement-status/employment-utils';
import { fetchPopulationData } from '$lib/charts/shared-component/population/population-utils';
import type { PageServerLoad } from './$types';
import { fetchIpcrPerformanceSummary } from './components/services/employee-performance-indicator';
import {
	fetchIREGMForPastFiveYears,
	fetchIREGMPerYear
} from './components/services/supervisor-office-IREGM';
import { fetchFacultyPerformance } from './components/services/supervisor-office-performance';
import { fetchTeachingEffectiveness } from './components/services/supervisor-office-teaching-effictiveness';
import { fetchPopulationPieData } from './components/services/supervisor-piechart';

export const load = (async ({
	locals: { supabase, profile, hasRole, getUserRolesAndPermissions }
}) => {
	if (!profile) {
		return { status: 401, redirect: '/login' };
	}

	try {
		//for checking
		const permissionAndRoles = getUserRolesAndPermissions(profile.id);

		//shared
		const populationData = await fetchPopulationData(supabase, profile, hasRole);
		const employeeStatus = await fetchEmployeeStatus(supabase, profile, hasRole);
		const academicRanks = await fetchAcademicRanksData(supabase, profile, hasRole);

		console.log(academicRanks);

		// Fetch dashboard data using our service function
		const pieData = await fetchPopulationPieData(supabase, profile, hasRole);

		const ipcrPerformanceIndicator = await fetchIpcrPerformanceSummary(supabase, profile.id);
		const facultyPerformance = await fetchFacultyPerformance(supabase, profile, hasRole);
		const teachingEffectiveness = await fetchTeachingEffectiveness(supabase, profile, hasRole);
		const accReportCategoryAvg = await fetchIREGMPerYear(supabase, profile, hasRole);
		const accReportCategoryHistory = await fetchIREGMForPastFiveYears(supabase, profile, hasRole);

		// Ensure we handle empty or undefined values
		return {
			employeeStatus: employeeStatus || null,
			populationData: populationData || null,
			academicRanks: academicRanks || null,
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
