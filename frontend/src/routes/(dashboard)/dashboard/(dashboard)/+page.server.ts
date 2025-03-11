import { fetchAcademicAccomplishmentPerformance } from '$lib/charts/head_of_op-vice_president/head_of_operating_unit/academic-accomplishment/utils';
import { fetchAcademicPerformance } from '$lib/charts/head_of_op-vice_president/head_of_operating_unit/academic-ipcr-analysis/utils';
import {
	fetchAcademicOfficesByUnit,
	fetchNonAcademicOfficesByUnit,
	fetchOfficesTeachingEffectiveness
} from '$lib/charts/head_of_op-vice_president/head_of_operating_unit/teaching-effectiveness/utils';
import { fetchTechAdminAccomplishmentPerformance } from '$lib/charts/head_of_op-vice_president/head_of_operating_unit/tech-admin-accomplishment/utils';
import { fetchTechAdminPerformance } from '$lib/charts/head_of_op-vice_president/head_of_operating_unit/tech-admin-ipcr-analysis/utils';
import { fetchAcademicRanksData } from '$lib/charts/shared-component/academic-rank/academic-utils';
import { fetchIREGMForPastFiveYears } from '$lib/charts/shared-component/accomplishment-IREGM-history/utils';
import { fetchIREGMPerYear } from '$lib/charts/shared-component/accomplishment-IREGM/utils';
import { fetchDpcrPerformanceSummary } from '$lib/charts/shared-component/dpcr/utils';
import { fetchEmployeeStatus } from '$lib/charts/shared-component/employement-status/employment-utils';
import { fetchIpcrPerformanceSummary } from '$lib/charts/shared-component/ipcr-bar-chart/ipcr-bar-chart-utils';
import { fetchEmployeeNatureOfWork } from '$lib/charts/shared-component/nature-of-work/nature-of-work-util';
import { fetchPopulationData } from '$lib/charts/shared-component/population/population-utils';
import { fetchTeachingEffectivenessIndividual } from '$lib/charts/shared-component/teaching-effectiveness/teaching-effectiveness-utils';
import { fetchTotalBudgetRequirement } from '$lib/charts/shared-component/total-budget-requirements/total-budget-requirements-utils';
import { fetchFacultyPerformance } from '$lib/charts/supervisor/faculty-performance/utils';
import { fetchTeachingEffectiveness } from '$lib/charts/supervisor/faculty-teaching-effectiveness/utils';
import type { PageServerLoad } from './$types';
export const load = (async ({
	locals: { supabase, profile, hasRole, getUserRolesAndPermissions }
}) => {
	if (!profile) {
		return { status: 401, redirect: '/login' };
	}

	try {
		// Execute all fetch operations concurrently using Promise.all with explicit promise variables
		const [
			permissionAndRoles,
			populationData,
			employeeStatus,
			academicRanks,
			totalBudgetRequirement,
			natureOfWorkData,
			ipcrPerformanceIndicator,
			ipcrTeachingEffectiveness,
			accReportCategoryAvg,
			accReportCategoryHistory,
			performanceData,
			teachingEffectiveness,
			dpcrPerformanceData,
			academicOffices,
			teachingEffectivenessByOffice,
			nonAcademicOffices,
			techAdminPerformance,
			academicPerformance,
			academicAccomplishmentPerformance,
			techAndAdminAccomplishmentPerformance
		] = await Promise.all([
			// For checking
			getUserRolesAndPermissions(profile.id),

			// Shared components
			fetchPopulationData(supabase, profile, hasRole),
			fetchEmployeeStatus(supabase, profile, hasRole),
			fetchAcademicRanksData(supabase, profile, hasRole),
			fetchTotalBudgetRequirement(supabase, profile, hasRole),
			fetchEmployeeNatureOfWork(supabase, profile, hasRole),
			fetchIpcrPerformanceSummary(supabase, profile.id),
			fetchTeachingEffectivenessIndividual(supabase, profile.id),
			fetchIREGMPerYear(supabase, profile, hasRole),
			fetchIREGMForPastFiveYears(supabase, profile, hasRole),

			// Dean Program Chair
			fetchFacultyPerformance(supabase, profile, hasRole),
			fetchTeachingEffectiveness(supabase, profile, hasRole),

			// Head of operating unit || vice president
			fetchDpcrPerformanceSummary(supabase, profile.id),
			fetchAcademicOfficesByUnit(supabase, profile.unit_id!),
			fetchOfficesTeachingEffectiveness(supabase, profile, hasRole),
			fetchNonAcademicOfficesByUnit(supabase, profile.unit_id!),
			fetchTechAdminPerformance(supabase, profile, hasRole),
			fetchAcademicPerformance(supabase, profile, hasRole),
			fetchAcademicAccomplishmentPerformance(supabase, profile, hasRole),
			fetchTechAdminAccomplishmentPerformance(supabase, profile, hasRole)
		]);

		// Ensure we handle empty or undefined values
		return {
			academicOffices: academicOffices || [],
			nonAcademicOffices: nonAcademicOffices || [],
			employeeStatus: employeeStatus || null,
			populationData: populationData || null,
			academicRanks: academicRanks || null,
			natureOfWorkData: natureOfWorkData || null,
			totalBudgetRequirement: totalBudgetRequirement || null,
			ipcrPerformanceIndicator: ipcrPerformanceIndicator || [],
			ipcrTeachingEffectiveness: ipcrTeachingEffectiveness || [],
			accReportCategoryHistory: accReportCategoryHistory || [],
			dpcrPerformanceSummaryData: dpcrPerformanceData || [],
			performanceData: performanceData || [],
			teachingEffectivenessData: teachingEffectiveness || [],
			accReportCategoryAvg: accReportCategoryAvg,
			teachingEffectivenessByOffice: teachingEffectivenessByOffice || [],
			techAdminPerformance: techAdminPerformance || [],
			academicPerformance: academicPerformance || [],
			academicAccomplishmentPerformance: academicAccomplishmentPerformance || [],
			techAndAdminAccomplishmentPerformance: techAndAdminAccomplishmentPerformance || []
		};
	} catch (error) {
		console.error('Error fetching dashboard data:', error);
		return { status: 500, error: new Error('Unable to fetch dashboard') };
	}
}) satisfies PageServerLoad;
