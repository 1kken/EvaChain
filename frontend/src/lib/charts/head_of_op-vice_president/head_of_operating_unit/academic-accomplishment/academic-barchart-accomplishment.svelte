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
	import { getHeadsChartStore, type OfficeAccomplishmentData } from '../../state';
	import { lightColorPalette, darkColorPalette, generateBorderColors } from '../helpers/colors';

	// Register required components for bar charts
	Chart.register(Tooltip, Title, BarController, CategoryScale, LinearScale, BarElement);

	const { academicAccomplishmentPerformance } = getHeadsChartStore();

	let accomplishmentData = $academicAccomplishmentPerformance || [];

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

		const labels = accomplishmentData.map((item: OfficeAccomplishmentData) => item.office_code);
		const values = accomplishmentData.map(
			(item: OfficeAccomplishmentData) => item.average_accomplishment
		);

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
						label: 'Accomplishment Rate',
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
						max: 100,
						ticks: {
							color: textColor,
							stepSize: 20
						},
						grid: { color: gridColor },
						title: {
							display: true,
							text: 'Accomplishment Rate (%)',
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
								const rate = context.parsed.y;
								let interpretation = '';

								// Map accomplishment rate to interpretation
								if (rate >= 90) {
									interpretation = 'Excellent';
								} else if (rate >= 80) {
									interpretation = 'Very Good';
								} else if (rate >= 70) {
									interpretation = 'Good';
								} else if (rate >= 60) {
									interpretation = 'Satisfactory';
								} else {
									interpretation = 'Needs Improvement';
								}

								return [
									`Office: ${context.label}`,
									`Accomplishment Rate: ${rate.toFixed(2)}%`,
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

	// Update chart when data changes
	$effect(() => {
		if (chart && accomplishmentData) {
			createChart($mode);
		}
	});
</script>

<canvas id="academic-accomplishment-rate-chart" bind:this={ctx}></canvas>
