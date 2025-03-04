<script lang="ts">
	import { getUserAuthStore } from '$lib/utils/rbac';
	import type { PageProps } from './$types';
	import EmployeeSection from './components/(dashboard)/employee-section.svelte';
	import SupervisorSection from './components/(dashboard)/supervisor-section.svelte';
	let props: PageProps = $props();
	const { hasRole } = getUserAuthStore();
</script>

<div class="grid grid-cols-1 gap-4">
	<div>
		<EmployeeSection ipcrPerformanceData={props.data.ipcrPerformanceIndicator!} />
	</div>
	{#if hasRole('dean') || hasRole('program_chair') || hasRole('head_of_office') || hasRole('head_of_operating_unit')}
		<div>
			<SupervisorSection
				populationPieChartProps={props.data.pieData!}
				performanceData={props.data.facultyPerformance!}
				teachingEffectivenessData={props.data.teachingEffectiveness!}
				accReportCategoryAvg={props.data.accReportCategoryAvg}
			/>
		</div>
	{/if}
</div>
