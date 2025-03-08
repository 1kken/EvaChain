<script lang="ts">
	import { setSharedChartStore } from '$lib/charts/shared-component/state';
	import { getUserAuthStore } from '$lib/utils/rbac';
	import type { PageProps } from './$types';
	import EmployeeSection from './components/(dashboard)/employee/employee-section.svelte';
	import { setDashboardControlsStore } from './components/state/sueprvisor_state';
	let props: PageProps = $props();
	const { hasRole } = getUserAuthStore();
	let { IREGMYear } = setDashboardControlsStore();

	let {
		populationData,
		employeeStatusData,
		academicRanksData,
		totalBudgetRequirementData,
		natureOfWorkData,
		ipcrPerformanceSummaryData,
		ipcrTeachingEffectivenessData
	} = setSharedChartStore();

	if (props.data.employeeStatus != null) {
		employeeStatusData.set(props.data.employeeStatus);
	}

	if (props.data.populationData != null) {
		populationData.set(props.data.populationData);
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
</script>

<div class="grid grid-cols-1 items-center justify-items-center gap-4">
	<div>
		<EmployeeSection />
	</div>
</div>
