<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { mode } from 'mode-watcher';

	import {
		Chart,
		Tooltip,
		Title,
		BarController,
		CategoryScale,
		LinearScale,
		BarElement
	} from 'chart.js';
	import type { ChartItem } from 'chart.js';
	import { getHeadsChartStore, type OfficePerformanceData } from '../../state';
	import { darkColorPalette, generateBorderColors, lightColorPalette } from '../helpers/colors';

	// Register required components for bar charts
	Chart.register(Tooltip, Title, BarController, CategoryScale, LinearScale, BarElement);

	const { techAdminPerformance } = getHeadsChartStore();

	let performanceData = $techAdminPerformance || [];

	let ctx: ChartItem;
	let chart: Chart | null = null;

	// Function to select colors from the palette based on number of offices
	function generateColorPalette(count: number, isDark: boolean) {
		// Select the appropriate color palette based on theme
		const baseColors = isDark ? darkColorPalette : lightColorPalette;

		// If we have more offices than colors, we'll repeat the colors
		const colors: string[] = [];
		for (let i = 0; i < count; i++) {
			colors.push(baseColors[i % baseColors.length]);
		}

		return colors;
	}

	function createChart(theme: string | undefined) {
		const isDark = theme === 'dark';
		const textColor = isDark ? 'white' : 'black';
		const gridColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';

		const labels = performanceData.map((item: OfficePerformanceData) => item.office_code);
		const values = performanceData.map((item: OfficePerformanceData) => item.average_performance);

		// Generate different colors for each office
		const backgroundColor = generateColorPalette(labels.length, isDark);
		const borderColor = generateBorderColors(backgroundColor);

		if (chart) {
			// Update existing chart instead of recreating
			chart.data.labels = labels;
			chart.data.datasets[0].data = values;
			chart.data.datasets[0].backgroundColor = backgroundColor;
			chart.data.datasets[0].borderColor = borderColor;

			// Update axis text and grid colors
			chart.options.scales!.x!.ticks!.color = textColor;
			chart.options.scales!.x!.grid!.color = gridColor;
			chart.options.scales!.y!.ticks!.color = textColor;
			chart.options.scales!.y!.grid!.color = gridColor;

			chart.options.plugins!.title!.color = textColor;

			chart.update();
			return;
		}

		// Create new chart if it doesn't exist
		chart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Performance Rating',
						data: values,
						backgroundColor: backgroundColor,
						borderColor: borderColor,
						borderWidth: 1
					}
				]
			},
			options: {
				responsive: true,
				scales: {
					x: {
						type: 'category',
						ticks: { color: textColor },
						grid: { color: gridColor }
					},
					y: {
						type: 'linear',
						min: 0,
						max: 5,
						ticks: {
							color: textColor,
							stepSize: 1
						},
						grid: { color: gridColor },
						title: {
							display: true,
							text: 'Rating (0-5)',
							color: textColor
						}
					}
				},
				plugins: {
					legend: {
						display: false // Hide the legend completely
					},
					tooltip: {
						callbacks: {
							label: (context) => {
								const rating = context.parsed.y;
								let interpretation = '';
								let percentage = 0;

								// Map rating to interpretation and percentage
								if (rating >= 4.9) {
									interpretation = 'Outstanding';
									percentage = 99;
								} else if (rating >= 4.0) {
									interpretation = 'Very Satisfactory';
									percentage = 90 + (rating - 4.0) * 10;
								} else if (rating >= 3.0) {
									interpretation = 'Satisfactory';
									percentage = 80 + (rating - 3.0) * 10;
								} else if (rating >= 2.0) {
									interpretation = 'Fair';
									percentage = 70 + (rating - 2.0) * 10;
								} else if (rating >= 1.0) {
									interpretation = 'Poor';
									percentage = 60 + (rating - 1.0) * 10;
								} else {
									interpretation = 'Poor';
									percentage = 60;
								}

								// Special case for rating of 5
								if (rating >= 5.0) {
									interpretation = 'Outstanding';
									percentage = 100;
								}

								return [
									`Office: ${context.label}`,
									`Rating: ${rating.toFixed(2)}`,
									`Interpretation: ${interpretation}`
								];
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

		// Clean up subscription when component is destroyed
		onDestroy(() => {
			unsubscribe();
			// Also destroy the chart to prevent memory leaks
			if (chart) {
				chart.destroy();
				chart = null;
			}
		});
	});
</script>

<canvas id="tech-admin-performance-chart" bind:this={ctx}></canvas>
