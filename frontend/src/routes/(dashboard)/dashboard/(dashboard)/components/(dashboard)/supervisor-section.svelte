<script lang="ts">
	import PopulationPieChart from '$lib/charts/supervisor/population-pie-chart.svelte';
	import * as Card from '$lib/components/ui/card/index.js';

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

	interface Props {
		populationPieChartProps: PopulationPieChartProps;
	}

	let { populationPieChartProps }: Props = $props();

	// Population pie chart
	const academicRanks = $derived(populationPieChartProps.academicRanks);
	const employeeStatus = $derived(populationPieChartProps.employeeStatus);
	const breakdownAcademicRanks = $derived(populationPieChartProps.breakdownAcademicRanks);
	const breakdownEmploymentStatus = $derived(populationPieChartProps.breakdownEmploymentStatus);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Employment Status and Academic Ranking</Card.Title>
	</Card.Header>
	<Card.Content>
		<PopulationPieChart
			{academicRanks}
			{employeeStatus}
			{breakdownAcademicRanks}
			{breakdownEmploymentStatus}
		/>
	</Card.Content>
</Card.Root>
