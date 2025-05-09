<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Chart, ArcElement, Tooltip, Title, PieController, Legend } from 'chart.js';
	import type { ChartItem } from 'chart.js';
	import { darkenColor } from '$lib/charts/helper/darkenColor';
	import { getSharedChartStore } from '../state';
	import { emptyDoughnutPlugin } from '$lib/charts/plugins/empty-pie';
	import { mode } from 'mode-watcher';

	let { academicRanksData } = getSharedChartStore();

	let { academicRanks, breakdownAcademicRanks } = $academicRanksData;

	// Register required components
	Chart.register(ArcElement, Tooltip, Title, PieController, Legend);

	// Register the emptyDoughnut plugin
	Chart.register(emptyDoughnutPlugin);

	// Calculate total for percentages
	let totalAcademicRanks = $derived(academicRanks.reduce((sum, rank) => sum + rank.count, 0));

	// State for the popup
	let showPopup = $state(false);
	let popupTitle = $state('');
	let popupSubtitle = $state('');
	let popupItems: { label: string; count: number; color: string; percentage: number }[] = $state(
		[]
	);

	let ctx: ChartItem;
	let chart: Chart;
	let unsubscribe: () => void;

	onMount(() => {
		// Initial chart creation with current mode
		createChart($mode);

		// Subscribe to theme changes
		unsubscribe = mode.subscribe((theme) => {
			if (chart) {
				chart.destroy();
			}
			createChart(theme);
		});
	});

	onDestroy(() => {
		// Clean up subscription when component is destroyed
		if (unsubscribe) {
			unsubscribe();
		}

		// Destroy chart when component is destroyed
		if (chart) {
			chart.destroy();
		}
	});

	function createChart(theme: string | undefined) {
		const isDark = theme === 'dark';
		const textColor = isDark ? 'white' : 'black';

		chart = new Chart(ctx, {
			type: 'pie',
			data: {
				datasets: [
					// Academic Ranks
					{
						data: academicRanks.map((rank) => rank.count),
						backgroundColor: academicRanks.map((rank) => rank.color),
						label: 'Academic Ranks'
					}
				],
				labels: academicRanks.map((rank) => rank.label)
			},
			options: {
				plugins: {
					legend: {
						display: true,
						position: 'right',
						labels: {
							usePointStyle: true,
							padding: 20,
							color: textColor,
							font: {
								size: 12
							}
						}
					},
					tooltip: {
						callbacks: {
							label: (context) => {
								const index = context.dataIndex;

								// Make sure we're not exceeding array bounds
								if (index >= academicRanks.length) return '';

								const item = academicRanks[index];
								const percentage = Math.round((item.count / totalAcademicRanks) * 100);

								return `${item.label}: ${item.count} (${percentage}%)`;
							}
						}
					},
					title: {
						display: false
					},
					// Configure the emptyDoughnut plugin with theme-aware colors
					emptyDoughnut: {
						color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
						width: 2,
						radiusDecrease: 20,
						text: 'No available data',
						fontColor: textColor,
						fontSize: 16,
						fontFamily: 'Arial'
					}
				},
				maintainAspectRatio: false,
				// Add click handler
				onClick: (event, elements) => {
					if (elements.length > 0) {
						const { index } = elements[0];

						// Academic Ranks
						const clickedRank = academicRanks[index];
						if (clickedRank) {
							showAcademicRankBreakdownPopup(clickedRank.label);
						} else {
							showAcademicRanksPopup();
						}
					}
				}
			}
		});
	}

	// Function to show all Academic Ranks popup
	function showAcademicRanksPopup() {
		popupTitle = 'Academic Ranks';
		popupSubtitle = '';
		popupItems = academicRanks.map((rank) => ({
			...rank,
			percentage: Math.round((rank.count / totalAcademicRanks) * 100)
		}));
		showPopup = true;
	}

	// Function to show breakdown for a specific Academic Rank
	function showAcademicRankBreakdownPopup(rankName: string) {
		// Find the breakdown data for this specific rank
		const rankBreakdown = breakdownAcademicRanks[rankName];

		if (rankBreakdown && rankBreakdown.items.length > 0) {
			// Calculate total for this specific rank
			const rankTotal = rankBreakdown.items.reduce((sum, item) => sum + item.count, 0);

			popupTitle = 'Academic Ranks';
			popupSubtitle = rankName;

			// Create items with percentages
			popupItems = rankBreakdown.items.map((item) => ({
				label: item.label,
				count: item.count,
				color: rankBreakdown.color,
				percentage: rankTotal > 0 ? Math.round((item.count / rankTotal) * 100) : 0
			}));

			showPopup = true;
		} else {
			// Fallback to showing all ranks if no breakdown found
			showAcademicRanksPopup();
		}
	}

	// Function to close popup
	function closePopup() {
		showPopup = false;
	}

	// Function to go back to main category list
	function backToMainCategory() {
		showAcademicRanksPopup();
	}

	// Update chart if data changes
	$effect(() => {
		if (chart) {
			// Update academic ranks data
			chart.data.datasets[0].data = academicRanks.map((rank) => rank.count);
			chart.data.datasets[0].backgroundColor = academicRanks.map((rank) => rank.color);
			chart.update();
		}
	});
</script>

<div class="relative h-48 w-full">
	<canvas id="pieChart" bind:this={ctx}></canvas>

	<!-- Popup -->
	{#if showPopup}
		<div
			class="bg-card text-card-foreground border-border absolute right-10 top-10 z-10 w-80 rounded-lg border p-4 shadow-lg"
		>
			<div class="mb-3 flex items-center justify-between">
				<div>
					<h3 class="text-lg font-semibold">{popupTitle}</h3>
					{#if popupSubtitle}
						<div class="flex items-center">
							<button
								class="text-primary hover:text-primary-foreground mr-2 text-xs"
								onclick={backToMainCategory}
							>
								← Back
							</button>
							<span class="text-muted-foreground text-sm">{popupSubtitle}</span>
						</div>
					{/if}
				</div>
				<button class="text-muted-foreground hover:text-foreground text-xl" onclick={closePopup}
					>×</button
				>
			</div>

			<div class="max-h-64 overflow-y-auto">
				{#each popupItems as item, i}
					<div class="mb-2 flex items-center">
						<div class="mr-2 h-4 w-4" style="background-color: {darkenColor(item.color, i)}"></div>
						<div class="flex-1">
							<div class="flex justify-between">
								<span class="text-sm">{item.label}</span>
								<span class="text-sm font-medium">{item.count}</span>
							</div>
							<div class="bg-muted mt-1 h-2 w-full rounded-full">
								<div
									class="h-2 rounded-full"
									style="width: {item.percentage}%; background-color: {darkenColor(item.color, i)}"
								></div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<div class="border-border mt-3 border-t pt-2">
				<div class="flex justify-between">
					<span class="font-medium">Total</span>
					<span class="font-medium">
						{popupItems.reduce((sum, item) => sum + item.count, 0)}
					</span>
				</div>
			</div>
		</div>
	{/if}
</div>
