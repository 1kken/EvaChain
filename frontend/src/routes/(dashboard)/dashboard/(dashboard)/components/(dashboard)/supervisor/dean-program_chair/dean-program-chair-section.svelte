<script lang="ts">
	import { getSharedChartStore } from '$lib/charts/shared-component/state';
	import LineChartFacultyPerformance from '$lib/charts/supervisor/faculty-performance/line-chart-faculty-performance.svelte';
	import LineChartFacultyTeaching from '$lib/charts/supervisor/faculty-teaching-effectiveness/line-chart-faculty-teaching.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	const { officeName } = getSharedChartStore();
</script>

<!-- Single Card containing both Academic Rank and Employment Status -->
<Card.Root class="h-full w-full  border-none">
	<Card.Content class="border-none">
		<div class="flex flex-col gap-4 md:flex-row">
			<!-- Academic Rank -->
			<div class="h-48 w-full md:w-1/2">
				<h1 class="font-semibold">{$officeName} Performance Analysis</h1>
				<LineChartFacultyPerformance />
			</div>

			<!-- Employment Status -->
			<div class="h-48 w-full md:w-1/2">
				<h1 class="font-semibold">{$officeName} Teaching Effectiveness</h1>
				<LineChartFacultyTeaching />
			</div>
		</div>
	</Card.Content>
</Card.Root>
