<script lang="ts">
	import { setHeadsChartStore } from '$lib/charts/head_of_op-vice_president/state';
	import { setDashboardControlsStore } from '$lib/charts/shared-component/iregm_state';
	import { setSharedChartStore } from '$lib/charts/shared-component/state';
	import { setSupervisorChartStore } from '$lib/charts/supervisor/state';
	import { getUserAuthStore } from '$lib/utils/rbac';
	import type { PageProps } from './$types';
	import EmployeeSection from './components/(dashboard)/employee/employee-section.svelte';
	import HeadsSection from './components/(dashboard)/heads/heads-section.svelte';
	import SupervisorSection from './components/(dashboard)/supervisor/supervisor-section.svelte';
	let props: PageProps = $props();

	const { hasRole } = getUserAuthStore();

	setDashboardControlsStore();
	let {
		officeName,
		populationData,
		employeeStatusData,
		academicRanksData,
		totalBudgetRequirementData,
		natureOfWorkData,
		ipcrPerformanceSummaryData,
		ipcrTeachingEffectivenessData,
		accReportCategoryHistory,
		accReportCategoryAvg,
		dpcrPerformanceSummaryData
	} = setSharedChartStore();

	let { performanceData, teachingEffectivenessData } = setSupervisorChartStore();

	let {
		teachingEffectivenessByOffice,
		academicOffices,
		nonAcademicOffices,
		techAdminPerformance,
		academicPerformance,
		academicAccomplishmentPerformance,
		techAndAdminAccomplishmentPerformance
	} = setHeadsChartStore();

	if (props.data.employeeStatus != null) {
		employeeStatusData.set(props.data.employeeStatus);
	}

	if (props.data.populationData != null) {
		populationData.set(props.data.populationData);
		officeName.set(props.data.populationData.titleName);
	}

	if (props.data.academicRanks != null) {
		academicRanksData.set(props.data.academicRanks);
	}

	if (props.data.totalBudgetRequirement != null) {
		totalBudgetRequirementData.set(props.data.totalBudgetRequirement);
	}

	if (props.data.natureOfWorkData != null) {
		natureOfWorkData.set(props.data.natureOfWorkData);
	}

	if (props.data.ipcrPerformanceIndicator != null) {
		ipcrPerformanceSummaryData.set(props.data.ipcrPerformanceIndicator);
	}

	if (props.data.ipcrTeachingEffectiveness != null) {
		ipcrTeachingEffectivenessData.set(props.data.ipcrTeachingEffectiveness);
	}

	if (props.data.accReportCategoryHistory != null) {
		accReportCategoryHistory.set(props.data.accReportCategoryHistory);
	}

	if (props.data.accReportCategoryAvg != null) {
		accReportCategoryAvg.set(props.data.accReportCategoryAvg);
	}

	if (props.data.performanceData != null) {
		performanceData.set(props.data.performanceData);
	}
	if (props.data.teachingEffectivenessData != null) {
		teachingEffectivenessData.set(props.data.teachingEffectivenessData);
	}
	if (props.data.dpcrPerformanceSummaryData != null) {
		dpcrPerformanceSummaryData.set(props.data.dpcrPerformanceSummaryData);
	}

	//HEads
	if (props.data.teachingEffectivenessByOffice != null) {
		teachingEffectivenessByOffice.set(props.data.teachingEffectivenessByOffice);
	}

	if (props.data.academicOffices != null) {
		academicOffices.set(props.data.academicOffices);
	}

	if (props.data.nonAcademicOffices != null) {
		nonAcademicOffices.set(props.data.nonAcademicOffices);
	}

	if (props.data.techAdminPerformance != null) {
		techAdminPerformance.set(props.data.techAdminPerformance);
	}

	if (props.data.academicPerformance != null) {
		academicPerformance.set(props.data.academicPerformance);
	}

	if (props.data.academicAccomplishmentPerformance != null) {
		academicAccomplishmentPerformance.set(props.data.academicAccomplishmentPerformance);
	}

	if (props.data.techAndAdminAccomplishmentPerformance != null) {
		techAndAdminAccomplishmentPerformance.set(props.data.techAndAdminAccomplishmentPerformance);
	}
</script>

<div class="flex w-full justify-center">
	<div class="grid max-w-fit grid-cols-1 items-center justify-items-center gap-4">
		<div>
			<EmployeeSection />
		</div>
		<div class="w-full">
			<SupervisorSection />
		</div>
		{#if hasRole('head_of_operating_unit') || hasRole('vice_president')}
			<div class="w-full">
				<HeadsSection />
			</div>
		{/if}
	</div>
</div>
