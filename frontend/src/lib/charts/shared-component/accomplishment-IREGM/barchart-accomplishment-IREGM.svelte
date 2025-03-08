<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { mode } from 'mode-watcher';
	import {
		Chart,
		BarController,
		BarElement,
		CategoryScale,
		LinearScale,
		Tooltip,
		Legend,
		type ChartItem
	} from 'chart.js';
	import type { Tables } from '$lib/types/database.types';
	import { getDashboardControlsStore } from '../iregm_state';
	import { getSharedChartStore } from '../state';

	// Register necessary Chart.js components
	Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

	let { accReportCategoryAvg } = getSharedChartStore();

	//states
	let { IREGMYear } = getDashboardControlsStore();

	let canvas: ChartItem;
	let chart: Chart | null = null;
	let currentYearData: Tables<'accomplishment_report_category_avg'> | null = null;
	let displayYear = '';
	let year: string | number = 'N/A';

	// Handle changes to IREGMYear or accReportCategoryAvg
	$effect(() => {
		// First, update the year display to match what was selected
		year = $IREGMYear || 'N/A';
		displayYear = `Accomplishment report analysis Year ${year}`;

		// Then filter data based on IREGMYear
		if ($accReportCategoryAvg && $accReportCategoryAvg.length > 0) {
			if ($IREGMYear) {
				// Filter by the selected year
				const filteredData = $accReportCategoryAvg.filter((report) => {
					const reportYear = report.created_at
						? new Date(report.created_at).getFullYear().toString()
						: '';
					return reportYear === $IREGMYear;
				});

				// Use the first match or null if none found
				currentYearData = filteredData.length > 0 ? filteredData[0] : null;
			} else {
				// If no year is selected, use the most recent report
				currentYearData = [...$accReportCategoryAvg].sort((a, b) => {
					const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
					const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
					return dateB - dateA; // Sort in descending order (newest first)
				})[0];

				// Update year display for latest report
				if (currentYearData?.created_at) {
					year = new Date(currentYearData.created_at).getFullYear();
					displayYear = `Accomplishment report analysis Year ${year}`;
				}
			}

			// Update chart with new data when it changes
			if (chart && canvas) {
				updateChartData();
			}
		} else {
			currentYearData = null;
		}
	});

	function updateChartData() {
		if (!chart) return;

		// Extract data from currentYearData or use default values if undefined
		const data = [
			currentYearData?.instruction_avg ?? 0,
			currentYearData?.research_avg ?? 0,
			currentYearData?.extension_avg ?? 0,
			currentYearData?.governance_management_avg ?? 0
		];

		chart.data.datasets[0].data = [data[0], 0, 0, 0];
		chart.data.datasets[1].data = [0, data[1], 0, 0];
		chart.data.datasets[2].data = [0, 0, data[2], 0];
		chart.data.datasets[3].data = [0, 0, 0, data[3]];

		// Update title
		if (chart.options.plugins?.title) {
			chart.options.plugins.title.text = displayYear;
		}

		chart.update();
	}

	function createChart(theme: string | undefined) {
		const isDark = theme === 'dark';
		const textColor = isDark ? 'white' : 'black';
		const gridColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';

		// Define colors for each category with dark mode alternatives
		const backgroundColors = isDark
			? [
					'rgba(255, 99, 132, 0.7)',
					'rgba(54, 162, 235, 0.7)',
					'rgba(255, 206, 86, 0.7)',
					'rgba(75, 192, 192, 0.7)'
				]
			: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)'
				];

		const borderColors = [
			'rgba(255, 99, 132, 1)',
			'rgba(54, 162, 235, 1)',
			'rgba(255, 206, 86, 1)',
			'rgba(75, 192, 192, 1)'
		];

		// Extract data from currentYearData or use default values if undefined
		const data = [
			currentYearData?.instruction_avg ?? 0,
			currentYearData?.research_avg ?? 0,
			currentYearData?.extension_avg ?? 0,
			currentYearData?.governance_management_avg ?? 0
		];

		if (chart) {
			// Update existing chart instead of recreating
			chart.data.datasets[0].data = [data[0], 0, 0, 0];
			chart.data.datasets[1].data = [0, data[1], 0, 0];
			chart.data.datasets[2].data = [0, 0, data[2], 0];
			chart.data.datasets[3].data = [0, 0, 0, data[3]];

			for (let i = 0; i < 4; i++) {
				chart.data.datasets[i].backgroundColor = backgroundColors[i];
				chart.data.datasets[i].borderColor = borderColors[i];
			}

			// Update text and grid colors
			chart.options.scales!.x!.ticks!.color = textColor;
			chart.options.scales!.x!.grid!.color = gridColor;
			chart.options.scales!.y!.ticks!.color = textColor;
			chart.options.scales!.y!.grid!.color = gridColor;

			chart.options.plugins!.legend!.labels!.color = textColor;

			// Update title
			if (chart.options.plugins?.title) {
				chart.options.plugins.title.text = displayYear;
			}

			chart.update();
			return;
		}

		// Create new chart if it doesn't exist
		chart = new Chart(canvas, {
			type: 'bar',
			data: {
				labels: ['Instruction', 'Research', 'Extension', 'Governance and Management'],
				datasets: [
					{
						label: 'Instruction',
						data: [data[0], 0, 0, 0],
						backgroundColor: backgroundColors[0],
						borderColor: borderColors[0],
						borderWidth: 1
					},
					{
						label: 'Research',
						data: [0, data[1], 0, 0],
						backgroundColor: backgroundColors[1],
						borderColor: borderColors[1],
						borderWidth: 1
					},
					{
						label: 'Extension',
						data: [0, 0, data[2], 0],
						backgroundColor: backgroundColors[2],
						borderColor: borderColors[2],
						borderWidth: 1
					},
					{
						label: 'Governance and Management',
						data: [0, 0, 0, data[3]],
						backgroundColor: backgroundColors[3],
						borderColor: borderColors[3],
						borderWidth: 1
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						ticks: { color: textColor },
						grid: { color: gridColor }
					},
					y: {
						beginAtZero: true,
						ticks: { color: textColor },
						grid: { color: gridColor },
						max: 100 // Set max to 100 for percentage display
					}
				},
				plugins: {
					legend: {
						display: false // Hide the legend completely
					},
					tooltip: {
						callbacks: {
							label: function (context) {
								let label = context.dataset.label || '';
								if (label) {
									label += ': ';
								}
								label += context.parsed.y?.toFixed(2) + '%';
								return label;
							}
						}
					}
				}
			}
		});
	}

	onMount(() => {
		// Ensure we only create the chart when the DOM element is available
		if (canvas) {
			// Initialize chart with current theme
			createChart($mode);
		}

		const unsubscribe = mode.subscribe((theme) => {
			// Only attempt to update if canvas is available
			if (canvas) {
				createChart(theme);
			}
		});

		// Clean up subscription when component is destroyed
		onDestroy(() => {
			unsubscribe();
			// Destroy the chart to prevent memory leaks
			if (chart) {
				chart.destroy();
				chart = null;
			}
		});
	});
</script>

<canvas bind:this={canvas}></canvas>
