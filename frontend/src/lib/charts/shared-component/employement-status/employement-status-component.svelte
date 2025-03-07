<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
	import type { ChartItem } from 'chart.js';
	import { getSharedChartStore } from '../state';
	import { emptyDoughnutPlugin } from '$lib/charts/plugins/empty-pie';
	import { mode } from 'mode-watcher';

	let { employeeStatusData } = getSharedChartStore();
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

		// Extract labels and data from the employeeStatusData
		const labels = Object.keys($employeeStatusData);
		const data = labels.map((key) => $employeeStatusData[key]);

		// Generate colors based on the number of status types
		const generateColors = (count: number) => {
			const colors = [
				'#FF6384',
				'#36A2EB',
				'#FFCE56',
				'#4BC0C0',
				'#9966FF',
				'#FF9F40',
				'#C9CBCF',
				'#7FC97F',
				'#BEAED4',
				'#FDC086'
			];

			// If we have more status types than predefined colors, repeat colors
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
						label: 'Employee Status',
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
