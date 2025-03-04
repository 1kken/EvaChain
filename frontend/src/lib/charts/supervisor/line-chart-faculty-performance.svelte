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

	interface PerformanceSummary {
		average: number;
		year: number;
		period: number; // 1 or 2
	}

	interface Props {
		performanceData: PerformanceSummary[];
	}

	let { performanceData }: Props = $props();

	let ctx: ChartItem;
	let chart: Chart | null = null;

	// Function to view PDF report
	const viewPdf = async (year: number, period: number) => {
		try {
			const response = await fetch(
				`/api/reports/ipcr_performance_summary?year=${year}&period=${period}&inline=true`,
				{
					method: 'POST'
				}
			);

			if (!response.ok) throw new Error('Failed to generate PDF');

			// Create blob URL and open in new tab
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			window.open(url, '_blank');

			// Clean up blob URL after opening
			setTimeout(() => URL.revokeObjectURL(url), 100);
		} catch (error) {
			console.error('Error viewing PDF:', error);
			// Handle error appropriately
		}
	};

	function createChart(theme: string | undefined) {
		const isDark = theme === 'dark';
		const textColor = isDark ? 'white' : 'black';
		const lineColor = isDark ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)';
		const lineBackgroundColor = isDark ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 99, 132, 0.5)';
		const barColor = isDark ? 'rgba(54, 162, 235, 0.7)' : 'rgba(54, 162, 235, 0.7)';
		const gridColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';

		// Sort the data by year and period
		const sortedData = [...performanceData].sort((a, b) => {
			// Sort by year (ascending) and then by period (ascending)
			if (a.year !== b.year) return a.year - b.year;
			return a.period - b.period;
		});

		// Format labels as "Year S1/S2" (Semester 1 or Semester 2)
		const labels = sortedData.map((item) => `${item.year} S${item.period}`);
		const averageValues = sortedData.map((item) => item.average);

		if (chart) {
			// Update existing chart
			chart.data.labels = labels;
			chart.data.datasets[0].data = averageValues;
			chart.data.datasets[1].data = averageValues;

			// Update colors
			chart.data.datasets[0].borderColor = lineColor;
			chart.data.datasets[0].backgroundColor = lineBackgroundColor;
			chart.data.datasets[1].backgroundColor = barColor;
			chart.data.datasets[1].borderColor = isDark
				? 'rgba(54, 162, 235, 1)'
				: 'rgba(54, 162, 235, 1)';

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
				labels: labels,
				datasets: [
					{
						type: 'line',
						label: 'Performance Trend',
						data: averageValues,
						borderColor: lineColor,
						backgroundColor: lineBackgroundColor,
						borderWidth: 2,
						tension: 0.3,
						yAxisID: 'y'
					},
					{
						type: 'bar',
						label: 'Period Average',
						data: averageValues,
						backgroundColor: barColor,
						borderColor: isDark ? 'rgba(54, 162, 235, 1)' : 'rgba(54, 162, 235, 1)',
						borderWidth: 1,
						yAxisID: 'y'
					}
				]
			},
			options: {
				responsive: true,
				onClick: (event, elements) => {
					console.log('Clicked on:', elements);
					if (elements.length > 0) {
						const index = elements[0].index;
						const item = sortedData[index];
						viewPdf(item.year, item.period);
					}
				},
				scales: {
					x: {
						type: 'category',
						ticks: { color: textColor },
						grid: { color: gridColor },
						title: {
							display: true,
							text: 'Evaluation Period',
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
							text: 'Average Rating',
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

								return [
									`Average Rating: ${rating.toFixed(2)}`,
									`Interpretation: ${interpretation}`,
									`Click to view detailed report`
								];
							},
							title: (tooltipItems) => {
								const index = tooltipItems[0].dataIndex;
								const item = sortedData[index];
								return `${item.year} ${item.period === 1 ? 'January-June' : 'July-December'}`;
							}
						}
					},
					title: {
						display: true,
						align: 'start',
						color: textColor,
						text: 'Faculty Performance Analysis (Click on bar/point to view details)'
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
			const sortedData = [...performanceData].sort((a, b) => {
				if (a.year !== b.year) return a.year - b.year;
				return a.period - b.period;
			});

			chart.data.labels = sortedData.map((item) => `${item.year} S${item.period}`);
			chart.data.datasets[0].data = sortedData.map((item) => item.average);
			chart.data.datasets[1].data = sortedData.map((item) => item.average);
			chart.update();
		}
	});
</script>

<div class="h-80 w-full cursor-pointer rounded-lg p-4 shadow-lg dark:bg-slate-700">
	<canvas id="faculty-performance-chart" bind:this={ctx}></canvas>
</div>
