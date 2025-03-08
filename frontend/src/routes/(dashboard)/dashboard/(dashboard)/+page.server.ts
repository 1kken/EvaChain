import { fetchAcademicRanksData } from '$lib/charts/shared-component/academic-rank/academic-utils';
import { fetchIREGMForPastFiveYears } from '$lib/charts/shared-component/accomplishment-IREGM-history/utils';
import { fetchIREGMPerYear } from '$lib/charts/shared-component/accomplishment-IREGM/utils';
import { fetchEmployeeStatus } from '$lib/charts/shared-component/employement-status/employment-utils';
import { fetchIpcrPerformanceSummary } from '$lib/charts/shared-component/ipcr-bar-chart/ipcr-bar-chart-utils';
import { fetchEmployeeNatureOfWork } from '$lib/charts/shared-component/nature-of-work/nature-of-work-util';
import { fetchPopulationData } from '$lib/charts/shared-component/population/population-utils';
import { fetchTeachingEffectivenessIndividual } from '$lib/charts/shared-component/teaching-effectiveness/teaching-effectiveness-utils';
import { fetchTotalBudgetRequirement } from '$lib/charts/shared-component/total-budget-requirements/total-budget-requirements-utils';
import type { PageServerLoad } from './$types';
import { fetchFacultyPerformance } from './components/services/supervisor-office-performance';
import { fetchTeachingEffectiveness } from './components/services/supervisor-office-teaching-effictiveness';

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
		const totalBudgetRequirement = await fetchTotalBudgetRequirement(supabase, profile, hasRole);
		const natureOfWorkData = await fetchEmployeeNatureOfWork(supabase, profile, hasRole);
		const ipcrPerformanceIndicator = await fetchIpcrPerformanceSummary(supabase, profile.id);
		const ipcrTeachingEffectiveness = await fetchTeachingEffectivenessIndividual(
			supabase,
			profile.id
		);

		const facultyPerformance = await fetchFacultyPerformance(supabase, profile, hasRole);
		const teachingEffectiveness = await fetchTeachingEffectiveness(supabase, profile, hasRole);
		const accReportCategoryAvg = await fetchIREGMPerYear(supabase, profile, hasRole);
		const accReportCategoryHistory = await fetchIREGMForPastFiveYears(supabase, profile, hasRole);

		// Ensure we handle empty or undefined values
		return {
			employeeStatus: employeeStatus || null,
			populationData: populationData || null,
			academicRanks: academicRanks || null,
			natureOfWorkData: natureOfWorkData || null,
			totalBudgetRequirement: totalBudgetRequirement || null,
			ipcrPerformanceIndicator: ipcrPerformanceIndicator || [],
			ipcrTeachingEffectiveness: ipcrTeachingEffectiveness || [],
			accReportCategoryHistory: accReportCategoryHistory || [],
			facultyPerformance: facultyPerformance || [],
			teachingEffectiveness: teachingEffectiveness || [],
			accReportCategoryAvg: accReportCategoryAvg
		};
	} catch (error) {
		console.error('Error fetching dashboard data:', error);
		return { status: 500, error: new Error('Unable to fetch dashboard') };
	}
}) satisfies PageServerLoad;
