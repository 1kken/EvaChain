<script lang="ts">
	import { setDashboardControlsStore } from '$lib/charts/shared-component/iregm_state';
	import { setSharedChartStore } from '$lib/charts/shared-component/state';
	import { setSupervisorChartStore } from '$lib/charts/supervisor/state';
	import { getUserAuthStore } from '$lib/utils/rbac';
	import type { PageProps } from './$types';
	import EmployeeSection from './components/(dashboard)/employee/employee-section.svelte';
	import SupervisorSection from './components/(dashboard)/supervisor/supervisor-section.svelte';
	let props: PageProps = $props();
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
		accReportCategoryAvg
	} = setSharedChartStore();

	let { performanceData, teachingEffectivenessData } = setSupervisorChartStore();

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
</script>

<div class="flex w-full justify-center">
	<div class="grid max-w-fit grid-cols-1 items-center justify-items-center gap-4">
		<div>
			<EmployeeSection />
		</div>
		<div class="w-full">
			<SupervisorSection />
		</div>
	</div>
</div>
