<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { mode } from 'mode-watcher';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { getHeadsChartStore } from '../../state';

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

	let { currentNonAcademicIpcrAnalysis } = getHeadsChartStore();

	type OfficePerformanceHistoryData = {
		office_id: number;
		office_code: string;
		office_name: string;
		year: number;
		period_1_avg: number;
		period_2_avg: number;
	}[];

	let performanceHistoryData: OfficePerformanceHistoryData = $state([]);
	let loading = $state(false);
	let error: string | null = $state(null);
	let ctx: ChartItem | null = $state(null);
	let chart: Chart | null = null;

	async function fetchOfficePerformanceHistory(officeId: string) {
		loading = true;
		error = null;
		try {
			const response = await fetch(`/api/charts/headopu/ipcr_analysis?officeId=${officeId}`);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.json();
			performanceHistoryData = data;
			return data;
		} catch (err) {
			console.error('Error fetching office performance history data:', err);
			error = err instanceof Error ? err.message : 'An error occurred';
			return [];
		} finally {
			loading = false;
		}
	}

	function createChart(theme: string | undefined) {
		if (!ctx || performanceHistoryData.length === 0) return;

		const isDark = theme === 'dark';
		const textColor = isDark ? 'white' : 'black';
		const period1Color = isDark ? 'rgb(106, 168, 79)' : 'rgb(39, 121, 61)'; // Green tones
		const period1BackgroundColor = isDark ? 'rgba(106, 168, 79, 0.5)' : 'rgba(39, 121, 61, 0.5)';
		const period2Color = isDark ? 'rgba(142, 124, 195, 0.7)' : 'rgba(103, 78, 167, 0.7)'; // Purple tones
		const period2BackgroundColor = isDark ? 'rgba(142, 124, 195, 0.5)' : 'rgba(103, 78, 167, 0.5)';
		const gridColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';

		const years = performanceHistoryData.map((item) => item.year.toString());
		const period1Values = performanceHistoryData.map((item) => item.period_1_avg);
		const period2Values = performanceHistoryData.map((item) => item.period_2_avg);

		if (chart) {
			// Update existing chart
			chart.data.labels = years;
			chart.data.datasets[0].data = period1Values;
			chart.data.datasets[1].data = period2Values;

			chart.data.datasets[0].borderColor = period1Color;
			chart.data.datasets[0].backgroundColor = period1BackgroundColor;

			chart.data.datasets[1].borderColor = period2Color;
			chart.data.datasets[1].backgroundColor = period2BackgroundColor;

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
			type: 'bar',
			data: {
				labels: years,
				datasets: [
					{
						type: 'bar',
						label: 'Jan-Jun Average',
						data: period1Values,
						borderColor: period1Color,
						backgroundColor: period1BackgroundColor,
						borderWidth: 1
					},
					{
						type: 'bar',
						label: 'Jul-Dec Average',
						data: period2Values,
						borderColor: period2Color,
						backgroundColor: period2BackgroundColor,
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
						max: 5,
						ticks: {
							color: textColor,
							stepSize: 1
						},
						grid: { color: gridColor },
						title: {
							display: true,
							text: 'Performance Rating',
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

								const datasetLabel = context.dataset.label || '';
								return [
									`${datasetLabel}: ${rating.toFixed(2)}`,
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

	$effect(() => {
		if ($currentNonAcademicIpcrAnalysis) {
			fetchOfficePerformanceHistory($currentNonAcademicIpcrAnalysis).then(() => {
				createChart($mode);
			});
		}
	});

	onMount(() => {
		// Initial chart creation if we already have data and DOM element
		if (ctx && performanceHistoryData.length > 0) {
			createChart($mode);
		}

		const unsubscribe = mode.subscribe((theme) => {
			// Update chart when theme changes
			if (ctx && performanceHistoryData.length > 0) {
				createChart(theme);
			}
		});

		return () => {
			unsubscribe();
			if (chart) {
				chart.destroy();
				chart = null;
			}
		};
	});
</script>

{#if loading}
	<Skeleton class="h-full w-full" />
{:else if error}
	<p>Error loading data: {error}</p>
{:else if !$currentNonAcademicIpcrAnalysis}
	<p>Please select an office to view performance history</p>
{:else if performanceHistoryData.length === 0}
	<p>No performance history data available for this office</p>
{:else}
	<canvas id="office-performance-history-chart" bind:this={ctx}></canvas>
{/if}
