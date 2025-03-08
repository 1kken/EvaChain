<script lang="ts">
	import DpcrPerformanceAnalysisComponents from '$lib/charts/shared-component/dpcr/dpcr-performance-analysis-components.svelte';
	import IpcrBarChartComponent from '$lib/charts/shared-component/ipcr-bar-chart/ipcr-bar-chart-component.svelte';
	import TeachingEffectivenessComponent from '$lib/charts/shared-component/teaching-effectiveness/teaching-effectiveness-component.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { getUserAuthStore } from '$lib/utils/rbac';

	const { hasRole } = getUserAuthStore();
	// Function to check if user is faculty-related role that should see teaching effectiveness
	function isFacultyRole() {
		return hasRole('dean') || hasRole('program_chair') || hasRole('faculty');
	}

	// Function to check if the Teaching Effectiveness section should be hidden
	function shouldHideTeachingEffectiveness() {
		return (
			hasRole('head_of_operating_unit') ||
			hasRole('director') ||
			hasRole('vice-president') ||
			hasRole('head_of_office') ||
			hasRole('staff')
		);
	}

	function showDpcr() {
		return hasRole('vice-president') || hasRole('head_of_operating_unit');
	}
</script>

<Card.Root class="h-full w-full border-none">
	<Card.Content class="border-none">
		<div class="flex flex-col gap-4 md:flex-row">
			<!-- IPCR Performance Analysis -->
			<div
				class={shouldHideTeachingEffectiveness() && !showDpcr()
					? 'h-48 w-full'
					: 'h-48 w-fit md:w-1/2'}
			>
				<h1 class="font-semibold">IPCR Performance Analysis</h1>
				<IpcrBarChartComponent />
			</div>

			{#if showDpcr()}
				<!-- DPCR Performance Analysis -->
				<div class="h-48 w-fit md:w-1/2">
					<h1 class="font-semibold">DPCR Performance Analysis</h1>
					<DpcrPerformanceAnalysisComponents />
				</div>
			{/if}

			{#if isFacultyRole()}
				<div class="h-48 w-fit md:w-1/2">
					<h1 class="font-semibold">Teaching Effectiveness Analysis</h1>
					<TeachingEffectivenessComponent />
				</div>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
