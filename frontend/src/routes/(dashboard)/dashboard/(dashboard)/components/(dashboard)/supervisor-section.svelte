<script lang="ts">
	import LineChartFacultyPerformance from '$lib/charts/supervisor/line-chart-faculty-performance.svelte';
	import LineChartFacultyTeaching from '$lib/charts/supervisor/line-chart-faculty-teaching.svelte';
	import PopulationPieChart from '$lib/charts/supervisor/population-pie-chart.svelte';

	// Updated type definition to match the new data structure
	type PopulationPieChartProps = {
		academicRanks: { label: string; count: number; color: string }[];
		employeeStatus: { label: string; count: number; color: string }[];
		breakdownAcademicRanks: Record<
			string,
			{
				color: string;
				items: { label: string; count: number }[];
			}
		>;
		breakdownEmploymentStatus: Record<
			string,
			{
				color: string;
				items: { label: string; count: number }[];
			}
		>;
	};

	// faculty performance data
	type PerformanceSummary = {
		average: number;
		year: number;
		period: number;
	};

	interface TeachingEffectivenessSummary {
		average: number;
		year: number;
		period: number;
	}
	interface Props {
		populationPieChartProps: PopulationPieChartProps;
		performanceData: PerformanceSummary[];
		teachingEffectivenessData: TeachingEffectivenessSummary[];
	}

	let { populationPieChartProps, performanceData, teachingEffectivenessData }: Props = $props();

	// Population pie chart
	const academicRanks = $derived(populationPieChartProps.academicRanks);
	const employeeStatus = $derived(populationPieChartProps.employeeStatus);
	const breakdownAcademicRanks = $derived(populationPieChartProps.breakdownAcademicRanks);
	const breakdownEmploymentStatus = $derived(populationPieChartProps.breakdownEmploymentStatus);
</script>

<div class="flex">
	<div class="grid w-full max-w-7xl grid-cols-3 gap-6">
		<!-- Performance Chart -->
		<div class="col-span-2 rounded-xl shadow-lg">
			<LineChartFacultyPerformance {performanceData} />
		</div>

		<!-- Faculty Population Chart -->
		<div class="row-span-2 flex items-center justify-center rounded-xl p-6 shadow-lg">
			<PopulationPieChart
				{academicRanks}
				{employeeStatus}
				{breakdownAcademicRanks}
				{breakdownEmploymentStatus}
			/>
		</div>

		<!-- Teaching Effectiveness Chart -->
		<div class="col-span-2 rounded-xl shadow-lg">
			<LineChartFacultyTeaching {teachingEffectivenessData} />
		</div>
	</div>
</div>
