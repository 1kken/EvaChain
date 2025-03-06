<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { mode } from 'mode-watcher';

	import {
		Chart,
		Tooltip,
		Legend,
		Title,
		LineController,
		BarController,
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		BarElement
	} from 'chart.js';
	import type { ChartItem } from 'chart.js';
	import { getDashboardControlsStore } from '../../../routes/(dashboard)/dashboard/(dashboard)/components/state/sueprvisor_state';

	// Register required components
	Chart.register(
		Tooltip,
		Legend,
		Title,
		LineController,
		BarController,
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		BarElement
	);

	// Interface matching our YearlyIREGMAverage structure
	interface YearlyIREGMAverage {
		year: number;
		over_all_grade: number;
	}

	interface Props {
		accReportCategoryHistory: YearlyIREGMAverage[];
	}

	let { accReportCategoryHistory }: Props = $props();
	let performanceData = accReportCategoryHistory;

	const { IREGMYear } = getDashboardControlsStore();

	let ctx: ChartItem;
	let chart: Chart | null = null;

	// Define blue gradient colors
	const blueGradient = [
		'#A0C4FF', // Light Blue
		'#80AFFF', // Sky Blue
		'#5E85FF', // Royal Blue
		'#3B60FF', // Deep Blue
		'#1E3EFF' // Navy Blue
	];

	function createChart(theme: string | undefined) {
		const isDark = theme === 'dark';
		const textColor = isDark ? 'white' : 'black';
		const gridColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';

		// Sort the data by year (ascending)
		const sortedData = [...performanceData].sort((a, b) => a.year - b.year);

		// Prepare arrays for chart data
		const years = sortedData.map((item) => item.year.toString());
		const grades = sortedData.map((item) => item.over_all_grade);

		// Generate gradient colors based on data length
		const barColors = sortedData.map((_, index) => {
			const colorIndex = Math.min(
				Math.floor((index / sortedData.length) * blueGradient.length),
				blueGradient.length - 1
			);
			return blueGradient[colorIndex];
		});

		// For line charts, use the deepest blue with transparency
		const lineColor = '#1E3EFF';
		const lineBackgroundColor = 'rgba(30, 62, 255, 0.5)';

		if (chart) {
			// Update existing chart
			chart.data.labels = years;
			chart.data.datasets[0].data = grades;
			chart.data.datasets[1].data = grades;
			chart.data.datasets[1].backgroundColor = barColors;

			// Update colors
			chart.data.datasets[0].borderColor = lineColor;
			chart.data.datasets[0].backgroundColor = lineBackgroundColor;

			// Update axis text and grid colors
			chart.options.scales!.x!.ticks!.color = textColor;
			chart.options.scales!.x!.grid!.color = gridColor;
			chart.options.scales!.y!.ticks!.color = textColor;
			chart.options.scales!.y!.grid!.color = gridColor;
			chart.options.plugins!.legend!.labels!.color = textColor;
			chart.options.plugins!.title!.color = textColor;

			chart.update();
			return;
		}

		// Create new chart
		chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: years,
				datasets: [
					{
						type: 'line',
						label: 'Performance Trend',
						data: grades,
						borderColor: lineColor,
						backgroundColor: lineBackgroundColor,
						borderWidth: 2,
						tension: 0.3,
						yAxisID: 'y'
					},
					{
						type: 'bar',
						label: 'Yearly Average',
						data: grades,
						backgroundColor: barColors,
						borderColor: isDark ? 'rgba(30, 62, 255, 1)' : 'rgba(30, 62, 255, 1)',
						borderWidth: 1,
						yAxisID: 'y'
					}
				]
			},
			options: {
				responsive: true,
				onClick: (event, elements) => {
					if (elements.length > 0) {
						const index = elements[0].index;
						const item = sortedData[index];
						$IREGMYear = item.year.toString();
					}
				},
				scales: {
					x: {
						type: 'category',
						ticks: { color: textColor },
						grid: { color: gridColor },
						title: {
							display: true,
							text: 'Year',
							color: textColor
						}
					},
					y: {
						type: 'linear',
						min: 0,
						max: 100,
						ticks: {
							color: textColor,
							stepSize: 20
						},
						grid: { color: gridColor },
						title: {
							display: true,
							text: 'Overall Grade (%)',
							color: textColor
						}
					}
				},
				plugins: {
					legend: {
						position: 'top',
						labels: { color: textColor }
					},
					tooltip: {
						callbacks: {
							label: (context) => {
								const grade = context.parsed.y;
								let interpretation = '';

								// Map grade to interpretation
								if (grade >= 90) {
									interpretation = 'Outstanding';
								} else if (grade >= 80) {
									interpretation = 'Very Satisfactory';
								} else if (grade >= 70) {
									interpretation = 'Satisfactory';
								} else if (grade >= 60) {
									interpretation = 'Fair';
								} else {
									interpretation = 'Poor';
								}

								return [`Overall Grade: ${grade.toFixed(2)}%`, `Interpretation: ${interpretation}`];
							},
							title: (tooltipItems) => {
								const index = tooltipItems[0].dataIndex;
								const item = sortedData[index];
								return `Year: ${item.year}`;
							}
						}
					},
					title: {
						display: true,
						align: 'start',
						color: textColor,
						text: 'Accomplishment report history analysis'
					}
				},
				maintainAspectRatio: false
			}
		});
	}

	onMount(() => {
		// Ensure we only create the chart when the DOM element is available
		if (ctx) {
			// Initialize chart with current theme
			createChart($mode);
		}

		const unsubscribe = mode.subscribe((theme) => {
			// Only attempt to update if ctx is available
			if (ctx) {
				createChart(theme);
			}
		});

		// Ensure we clean up the subscription when the component is destroyed
		onDestroy(() => {
			unsubscribe();
			// Also make sure to destroy the chart to prevent memory leaks
			if (chart) {
				chart.destroy();
				chart = null;
			}
		});
	});

	// Update chart when data changes
	$effect(() => {
		if (chart && performanceData) {
			const sortedData = [...performanceData].sort((a, b) => a.year - b.year);
			chart.data.labels = sortedData.map((item) => item.year.toString());
			chart.data.datasets[0].data = sortedData.map((item) => item.over_all_grade);
			chart.data.datasets[1].data = sortedData.map((item) => item.over_all_grade);

			// Update bar colors with gradient
			const barColors = sortedData.map((_, index) => {
				const colorIndex = Math.min(
					Math.floor((index / sortedData.length) * blueGradient.length),
					blueGradient.length - 1
				);
				return blueGradient[colorIndex];
			});
			chart.data.datasets[1].backgroundColor = barColors;

			chart.update();
		}
	});
</script>

<div class="h-80 w-full cursor-pointer rounded-lg p-4 shadow-lg dark:bg-slate-700">
	<canvas id="iregm-performance-chart" bind:this={ctx}></canvas>
</div>
