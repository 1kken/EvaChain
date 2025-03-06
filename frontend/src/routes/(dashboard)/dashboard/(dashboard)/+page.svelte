<script lang="ts">
	import { getUserAuthStore } from '$lib/utils/rbac';
	import type { PageProps } from './$types';
	import EmployeeSection from './components/(dashboard)/employee-section.svelte';
	import SupervisorSection from './components/(dashboard)/supervisor-section.svelte';
	import { setDashboardControlsStore } from './components/state/sueprvisor_state';
	let props: PageProps = $props();
	const { hasRole } = getUserAuthStore();
	let { IREGMYear } = setDashboardControlsStore();

	$inspect($IREGMYear);
</script>

<div class="grid grid-cols-1 gap-4">
	<div>
		<EmployeeSection ipcrPerformanceData={props.data.ipcrPerformanceIndicator!} />
	</div>
	{#if hasRole('dean') || hasRole('program_chair') || hasRole('head_of_office')}
		<div>
			<SupervisorSection
				populationPieChartProps={props.data.pieData!}
				performanceData={props.data.facultyPerformance!}
				teachingEffectivenessData={props.data.teachingEffectiveness!}
				accReportCategoryAvg={props.data.accReportCategoryAvg}
				accReportCategoryHistory={props.data.accReportCategoryHistory!}
			/>
		</div>
	{/if}
</div>
