<script lang="ts">
	import { setSharedChartStore } from '$lib/charts/shared-component/state';
	import { getUserAuthStore } from '$lib/utils/rbac';
	import type { PageProps } from './$types';
	import EmployeeSection from './components/(dashboard)/employee/employee-section.svelte';
	import { setDashboardControlsStore } from './components/state/sueprvisor_state';
	let props: PageProps = $props();
	const { hasRole } = getUserAuthStore();
	let { IREGMYear } = setDashboardControlsStore();

	let { populationData, employeeStatusData, academicRanksData, totalBudgetRequirementData } =
		setSharedChartStore();

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
</script>

<div class="grid grid-cols-1 gap-4">
	<div>
		<EmployeeSection />
	</div>
	<!-- {#if hasRole('dean') || hasRole('program_chair') || hasRole('head_of_office')}
		<div>
			<SupervisorSection
				populationPieChartProps={props.data.pieData!}
				performanceData={props.data.facultyPerformance!}
				teachingEffectivenessData={props.data.teachingEffectiveness!}
				accReportCategoryAvg={props.data.accReportCategoryAvg}
				accReportCategoryHistory={props.data.accReportCategoryHistory!}
			/>
		</div>
	{/if} -->
</div>
