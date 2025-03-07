<script lang="ts">
	import type { PopulationProps } from '$lib/charts/shared-component/population/population-component.svelte';
	import PopulationComponent from '$lib/charts/shared-component/population/population-component.svelte';
	import type { Tables } from '$lib/types/database.types';
	interface Props {
		ipcrPerformanceData: Tables<'ipcr_performance_summary'>[];
		populationProps: PopulationProps | null | undefined;
	}

	let { ipcrPerformanceData, populationProps }: Props = $props();
</script>

<div class="flex">
	{#if populationProps}
		<PopulationComponent {populationProps} />
	{/if}
</div>
<!-- <LineChartIpcrPerformance {ipcrPerformanceData} /> -->
