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

	let { currentAcademicAccomplishmentAnalysis } = getHeadsChartStore();

	type AccomplishmentReportData = {
		id: string;
		title: string;
		created_at: string;
		total_accomplishment_rate: number;
	}[];

	let accomplishmentData: AccomplishmentReportData = $state([]);
	let loading = $state(false);
	let error: string | null = $state(null);
	let ctx: ChartItem | null = $state(null);
	let chart: Chart | null = null;

	async function fetchAccomplishmentReportData(officeId: string) {
		loading = true;
		error = null;
		try {
			const response = await fetch(
				`/api/charts/headopu/accomplishment_analysis?officeId=${officeId}`
			);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const data = await response.json();
			accomplishmentData = data;
			return data;
		} catch (err) {
			console.error('Error fetching accomplishment report data:', err);
			error = err instanceof Error ? err.message : 'An error occurred';
			return [];
		} finally {
			loading = false;
		}
	}

	function createChart(theme: string | undefined) {
		if (!ctx || accomplishmentData.length === 0) return;

		const isDark = theme === 'dark';
		const textColor = isDark ? 'white' : 'black';
		const barColor = isDark ? 'rgb(255, 159, 67)' : 'rgb(255, 130, 0)'; // Orange
		const barBackgroundColor = isDark ? 'rgba(255, 159, 67, 0.7)' : 'rgba(255, 130, 0, 0.7)';
		const gridColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';

		// Sort data by created_at
		const sortedData = [...accomplishmentData].sort(
			(a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
		);

		// Format dates to show only month and year
		const labels = sortedData.map((item) => {
			const date = new Date(item.created_at);
			return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
		});

		const values = sortedData.map((item) => item.total_accomplishment_rate);

		if (chart) {
			// Update existing chart
			chart.data.labels = labels;
			chart.data.datasets[0].data = values;

			chart.data.datasets[0].borderColor = barColor;
			chart.data.datasets[0].backgroundColor = barBackgroundColor;

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
				labels: labels,
				datasets: [
					{
						type: 'bar',
						label: 'Accomplishment Rate',
						data: values,
						borderColor: barColor,
						backgroundColor: barBackgroundColor,
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
							text: 'Report Date',
							color: textColor
						}
					},
					y: {
						type: 'linear',
						min: 0,
						max: 100,
						ticks: {
							color: textColor,
							stepSize: 10
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
						position: 'top',
						labels: { color: textColor }
					},
					title: {
						display: true,
						text: 'Office Accomplishment History',
						color: textColor
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

								const index = context.dataIndex;
								const reportTitle = sortedData[index]?.title || '';

								return [
									`Accomplishment Rate: ${rate.toFixed(2)}%`,
									`Interpretation: ${interpretation}`,
									`Report: ${reportTitle}`
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
		if ($currentAcademicAccomplishmentAnalysis) {
			fetchAccomplishmentReportData($currentAcademicAccomplishmentAnalysis).then(() => {
				createChart($mode);
			});
		}
	});

	onMount(() => {
		// Initial chart creation if we already have data and DOM element
		if (ctx && accomplishmentData.length > 0) {
			createChart($mode);
		}

		const unsubscribe = mode.subscribe((theme) => {
			// Update chart when theme changes
			if (ctx && accomplishmentData.length > 0) {
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
{:else if !$currentAcademicAccomplishmentAnalysis}
	<p>Please select an office to view accomplishment history</p>
{:else if accomplishmentData.length === 0}
	<p>No accomplishment data available for this office</p>
{:else}
	<canvas id="office-accomplishment-chart" bind:this={ctx}></canvas>
{/if}
