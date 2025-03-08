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
	import { getSharedChartStore } from '../state';

	// Register required components including BarController and BarElement for bar charts
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

	const { ipcrTeachingEffectivenessData } = getSharedChartStore();

	let effectivenessData = $ipcrTeachingEffectivenessData || [];

	let ctx: ChartItem;
	let chart: Chart | null = null;

	function createChart(theme: string | undefined) {
		const isDark = theme === 'dark';
		const textColor = isDark ? 'white' : 'black';
		const lineColor = isDark ? 'rgb(106, 168, 79)' : 'rgb(39, 121, 61)'; // Green tones
		const lineBackgroundColor = isDark ? 'rgba(106, 168, 79, 0.5)' : 'rgba(39, 121, 61, 0.5)';
		const barColor = isDark ? 'rgba(142, 124, 195, 0.7)' : 'rgba(103, 78, 167, 0.7)'; // Purple tones
		const gridColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';

		const labels = effectivenessData.map((item) => {
			const date = new Date(item.created_at!);
			return `${date.toLocaleDateString()}`;
		});

		const teachingValues = effectivenessData.map((item) => item.teaching_effectiveness_avg);

		if (chart) {
			// Update existing chart instead of recreating
			chart.data.datasets[0].borderColor = lineColor;
			chart.data.datasets[0].backgroundColor = lineBackgroundColor;

			if (chart.data.datasets[1]) {
				chart.data.datasets[1].backgroundColor = barColor;
				chart.data.datasets[1].borderColor = isDark
					? 'rgba(142, 124, 195, 1)'
					: 'rgba(103, 78, 167, 1)';
			}

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

		// Create new chart if it doesn't exist
		chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						type: 'line',
						label: 'Teaching Effectiveness Trend',
						data: teachingValues,
						borderColor: lineColor,
						backgroundColor: lineBackgroundColor,
						borderWidth: 2,
						tension: 0.3,
						yAxisID: 'y'
					},
					{
						type: 'bar',
						label: 'Teaching Effectiveness Score',
						data: teachingValues,
						backgroundColor: barColor,
						borderColor: isDark ? 'rgba(142, 124, 195, 1)' : 'rgba(103, 78, 167, 1)',
						borderWidth: 1,
						yAxisID: 'y'
					}
				]
			},
			options: {
				responsive: true,
				scales: {
					x: {
						type: 'category',
						ticks: { color: textColor },
						grid: { color: gridColor },
						title: {
							display: true,
							text: 'Date',
							color: textColor
						}
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
							text: 'Rating',
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

								return [`Rating: ${rating.toFixed(2)}`, `Interpretation: ${interpretation}`];
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
</script>

<canvas id="teaching-effectiveness-chart" bind:this={ctx}></canvas>
