<script lang="ts">
	import LineChartIpcrPerformance from '$lib/charts/employee/line-chart-ipcr-performance.svelte';
	import type { Tables } from '$lib/types/database.types';
	interface Props {
		ipcrPerformanceData: Tables<'ipcr_performance_summary'>[];
	}

	let { ipcrPerformanceData }: Props = $props();
</script>

<LineChartIpcrPerformance {ipcrPerformanceData} />
