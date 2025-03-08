<script lang="ts">
	import { setDashboardControlsStore } from '$lib/charts/shared-component/iregm_state';
	import { setSharedChartStore } from '$lib/charts/shared-component/state';
	import { getUserAuthStore } from '$lib/utils/rbac';
	import type { PageProps } from './$types';
	import EmployeeSection from './components/(dashboard)/employee/employee-section.svelte';
	let props: PageProps = $props();
	const { hasRole } = getUserAuthStore();
	let { IREGMYear } = setDashboardControlsStore();

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
</script>

<div class="grid grid-cols-1 items-center justify-items-center gap-4">
	<div>
		<EmployeeSection />
	</div>
</div>
