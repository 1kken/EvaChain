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
	import { getDashboardControlsStore } from '../iregm_state';
	import { getSharedChartStore } from '../state';

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

	let { accReportCategoryHistory } = getSharedChartStore();

	let performanceData = $accReportCategoryHistory || [];

	const { IREGMYear } = getDashboardControlsStore();

	let ctx: ChartItem;
	let chart: Chart | null = null;

	// Define new gradient colors
	const gradientColors = [
		'#FF9F43', // Orange
		'#28C76F', // Green
		'#EA5455', // Red
		'#7367F0', // Purple
		'#00CFE8' // Cyan
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
				Math.floor((index / sortedData.length) * gradientColors.length),
				gradientColors.length - 1
			);
			return gradientColors[colorIndex];
		});

		// For line charts, use a vibrant color with transparency
		const lineColor = '#7367F0';
		const lineBackgroundColor = 'rgba(115, 103, 240, 0.5)';

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
						borderColor: isDark ? 'rgba(115, 103, 240, 1)' : 'rgba(115, 103, 240, 1)',
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
					Math.floor((index / sortedData.length) * gradientColors.length),
					gradientColors.length - 1
				);
				return gradientColors[colorIndex];
			});
			chart.data.datasets[1].backgroundColor = barColors;

			chart.update();
		}
	});
</script>

<canvas id="iregm-performance-chart" bind:this={ctx}></canvas>
