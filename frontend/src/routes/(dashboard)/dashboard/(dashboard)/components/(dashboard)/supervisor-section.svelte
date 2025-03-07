<!-- <script lang="ts">
	import BarChartForIregmPerformance from '$lib/charts/supervisor/bar-chart-for-IREGM-performance.svelte';
	import BarChartIregmHistory from '$lib/charts/supervisor/bar-chart-IREGM-history.svelte';
	import LineChartFacultyPerformance from '$lib/charts/supervisor/line-chart-faculty-performance.svelte';
	import LineChartFacultyTeaching from '$lib/charts/supervisor/line-chart-faculty-teaching.svelte';
	import PopulationPieChart from '$lib/charts/supervisor/population-pie-chart.svelte';
	import type { Tables } from '$lib/types/database.types';

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

	// fopr teaching effectiveness data
	interface TeachingEffectivenessSummary {
		average: number;
		year: number;
		period: number;
	}

	interface YearlyIREGMAverage {
		year: number;
		over_all_grade: number;
	}
	interface Props {
		populationPieChartProps: PopulationPieChartProps;
		performanceData: PerformanceSummary[];
		teachingEffectivenessData: TeachingEffectivenessSummary[];
		accReportCategoryAvg: Tables<'accomplishment_report_category_avg'>[] | null | undefined;
		accReportCategoryHistory: YearlyIREGMAverage[];
	}

	interface YearlyIREGMAverage {
		year: number;
		over_all_grade: number;
	}

	let {
		populationPieChartProps,
		performanceData,
		teachingEffectivenessData,
		accReportCategoryAvg,
		accReportCategoryHistory
	}: Props = $props();

	// Population pie chart
	const academicRanks = $derived(populationPieChartProps.academicRanks);
	const employeeStatus = $derived(populationPieChartProps.employeeStatus);
	const breakdownAcademicRanks = $derived(populationPieChartProps.breakdownAcademicRanks);
	const breakdownEmploymentStatus = $derived(populationPieChartProps.breakdownEmploymentStatus);
</script> -->

<BarChartIregmHistory {accReportCategoryHistory} />
<div class="flex">
	<div class="grid w-full max-w-full grid-cols-3 gap-6">
		<!-- Performance Chart -->
		<div class="col-span-2 rounded-xl shadow-lg">
			<LineChartFacultyPerformance {performanceData} />
		</div>

		<!-- Faculty Population Chart -->
		<div class="row-span-2 flex flex-col items-center justify-center rounded-xl p-6 shadow-lg">
			<div class="mt-4 w-full">
				<BarChartForIregmPerformance {accReportCategoryAvg} />
			</div>
			<div class="flex w-full items-center justify-center">
				<PopulationPieChart
					{academicRanks}
					{employeeStatus}
					{breakdownAcademicRanks}
					{breakdownEmploymentStatus}
				/>
			</div>
		</div>

		<!-- Teaching Effectiveness Chart -->
		<div class="col-span-2 rounded-xl shadow-lg">
			<LineChartFacultyTeaching {teachingEffectivenessData} />
		</div>
	</div>
</div>
