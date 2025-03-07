<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
	import type { ChartItem } from 'chart.js';
	import { getSharedChartStore } from '../state';
	import { emptyDoughnutPlugin } from '$lib/charts/plugins/empty-pie';
	import { mode } from 'mode-watcher';

	let { natureOfWorkData } = getSharedChartStore();
	let chartCanvas: ChartItem;
	let chart: Chart;

	onMount(() => {
		// Register the required components
		Chart.register(PieController, ArcElement, Tooltip, Legend);
		Chart.register(emptyDoughnutPlugin);

		// Initial chart creation
		createChart($mode);

		// Subscribe to theme changes
		const unsubscribe = mode.subscribe((theme) => {
			if (chart) {
				chart.destroy();
			}
			createChart(theme);
		});

		// Clean up on component destruction
		return () => {
			unsubscribe();
			if (chart) {
				chart.destroy();
			}
		};
	});

	function createChart(theme: string | undefined) {
		const isDark = theme === 'dark';
		const textColor = isDark ? 'white' : 'black';

		// Extract labels and data from the natureOfWorkData
		const labels = Object.keys($natureOfWorkData);
		const data = labels.map((key) => $natureOfWorkData[key]);

		// Generate colors for nature of work (using a more green/blue palette)
		const generateColors = (count: number) => {
			const colors = [
				'#3498db', // Blue
				'#2ecc71', // Green
				'#27ae60', // Dark Green
				'#1abc9c', // Turquoise
				'#16a085', // Dark Turquoise
				'#2980b9', // Dark Blue
				'#00bcd4', // Cyan
				'#009688', // Teal
				'#4caf50', // Light Green
				'#8bc34a' // Lime
			];

			// If we have more nature types than predefined colors, repeat colors
			return Array(count)
				.fill(0)
				.map((_, i) => colors[i % colors.length]);
		};

		const backgroundColor = generateColors(labels.length);

		chart = new Chart(chartCanvas, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Nature of Work',
						data: data,
						backgroundColor: backgroundColor,
						hoverBackgroundColor: backgroundColor,
						hoverOffset: 1
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					tooltip: {
						callbacks: {
							label: function (context) {
								const label = context.label || '';
								const value = context.parsed || 0;
								const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
								const percentage = Math.round((value * 100) / total);
								return `${label}: ${value} (${percentage}%)`;
							}
						}
					},
					legend: {
						position: 'right',
						labels: {
							color: textColor,
							font: {
								size: 12,
								family: 'Arial'
							},
							padding: 10
						}
					},
					emptyDoughnut: {
						color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
						width: 2,
						radiusDecrease: 20,
						text: 'No available data',
						fontColor: textColor,
						fontSize: 16,
						fontFamily: 'Arial'
					}
				}
			}
		});
	}
</script>

<canvas bind:this={chartCanvas}></canvas>
