<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, ArcElement, Tooltip, Legend, Title, PieController } from 'chart.js';
	import type { ChartItem } from 'chart.js';
	import { darkenColor } from './utils';

	// Register required components
	Chart.register(ArcElement, Tooltip, Legend, Title, PieController);

	type Props = {
		academicRanks: { label: string; count: number; color: string }[];
		employeeStatus: { label: string; count: number; color: string }[];
		breakdownAcademicRanks: Record<
			string,
			{
				color: string;
				items: { label: string; count: number }[];
			}
		>;
		breakdownEmploymentStatus: Record<
			string,
			{
				color: string;
				items: { label: string; count: number }[];
			}
		>;
	};

	let { academicRanks, employeeStatus, breakdownAcademicRanks, breakdownEmploymentStatus }: Props =
		$props();

	// Calculate total populations
	let totalAcademicRanks = $derived(academicRanks.reduce((sum, rank) => sum + rank.count, 0));
	let totalEmployeeStatus = $derived(employeeStatus.reduce((sum, status) => sum + status.count, 0));
	let totalPopulation = $derived(Math.max(totalAcademicRanks, totalEmployeeStatus));

	// State for the popup
	let showPopup = $state(false);
	let popupTitle = $state('');
	let popupSubtitle = $state('');
	let popupItems: { label: string; count: number; color: string; percentage: number }[] = $state(
		[]
	);

	let ctx: ChartItem;
	let chart: Chart;

	onMount(() => {
		chart = new Chart(ctx, {
			type: 'pie',
			data: {
				datasets: [
					// Outer ring - Employee Status
					{
						data: employeeStatus.map((status) => status.count),
						backgroundColor: employeeStatus.map((status) => status.color),
						label: 'Employment Status',
						// Outer ring is slightly larger
						weight: 1
					},
					// Inner ring - Academic Ranks
					{
						data: academicRanks.map((rank) => rank.count),
						backgroundColor: academicRanks.map((rank) => rank.color),
						label: 'Academic Ranks',
						// Inner ring is smaller
						weight: 2
					}
				],
				// Add labels separately for each dataset to avoid confusion
				labels: []
			},
			options: {
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						callbacks: {
							label: (context) => {
								const datasetIndex = context.datasetIndex;
								const index = context.dataIndex;

								// Get the correct dataset based on the index
								let dataArray, totalValue, datasetName;

								if (datasetIndex === 0) {
									// Outer ring - Employee Status
									dataArray = employeeStatus;
									totalValue = totalEmployeeStatus;
									datasetName = 'Employment Status';
								} else {
									// Inner ring - Academic Ranks
									dataArray = academicRanks;
									totalValue = totalAcademicRanks;
									datasetName = 'Academic Ranks';
								}

								// Make sure we're not exceeding array bounds
								if (index >= dataArray.length) return '';

								const item = dataArray[index];
								const percentage = Math.round((item.count / totalValue) * 100);

								return `${datasetName} - ${item.label}: ${item.count} (${percentage}%)`;
							}
						}
					},
					title: {
						display: true,
						text: `Faculty Population: ${totalPopulation}`,
						font: {
							size: 18
						},
						padding: {
							bottom: 10
						}
					}
				},
				// Make the pie chart a donut to create the nesting effect
				cutout: '40%',
				radius: '90%',
				maintainAspectRatio: false,
				// Add click handler
				onClick: (event, elements) => {
					if (elements.length > 0) {
						const { datasetIndex, index } = elements[0];

						// Determine which dataset was clicked
						if (datasetIndex === 0) {
							// Employee Status (outer ring) - disabled
							/* 
							const clickedStatus = employeeStatus[index];
							if (clickedStatus) {
								showEmploymentBreakdownPopup(clickedStatus.label);
							} else {
								showEmployeeStatusPopup();
							}
							*/
						} else {
							// Academic Ranks (inner ring)
							const clickedRank = academicRanks[index];
							if (clickedRank) {
								showAcademicRankBreakdownPopup(clickedRank.label);
							} else {
								showAcademicRanksPopup();
							}
						}
					}
				}
			}
		});
	});

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

	/* 
	// Function to show all Employee Status popup
	function showEmployeeStatusPopup() {
		popupTitle = 'Employment Status';
		popupSubtitle = '';
		popupItems = employeeStatus.map((status) => ({
			...status,
			percentage: Math.round((status.count / totalEmployeeStatus) * 100)
		}));
		showPopup = true;
	}

	// Function to show breakdown for a specific Employment Status
	function showEmploymentBreakdownPopup(statusName: string) {
		// Find the breakdown data for this specific status
		const statusBreakdown = breakdownEmploymentStatus[statusName];

		if (statusBreakdown && statusBreakdown.items.length > 0) {
			// Calculate total for this specific status
			const statusTotal = statusBreakdown.items.reduce((sum, item) => sum + item.count, 0);

			popupTitle = 'Employment Status';
			popupSubtitle = statusName;

			// Create items with percentages
			popupItems = statusBreakdown.items.map((item) => ({
				label: item.label,
				count: item.count,
				color: statusBreakdown.color,
				percentage: statusTotal > 0 ? Math.round((item.count / statusTotal) * 100) : 0
			}));

			showPopup = true;
		} else {
			// Fallback to showing all statuses if no breakdown found
			showEmployeeStatusPopup();
		}
	}
	*/

	// Function to close popup
	function closePopup() {
		showPopup = false;
	}

	// Function to go back to main category list
	function backToMainCategory() {
		if (popupTitle === 'Academic Ranks') {
			showAcademicRanksPopup();
		} /* else {
			showEmployeeStatusPopup();
		} */
	}

	// Update chart if data changes
	$effect(() => {
		if (chart) {
			// Update employee status data (outer ring)
			chart.data.datasets[0].data = employeeStatus.map((status) => status.count);
			chart.data.datasets[0].backgroundColor = employeeStatus.map((status) => status.color);

			// Update academic ranks data (inner ring)
			chart.data.datasets[1].data = academicRanks.map((rank) => rank.count);
			chart.data.datasets[1].backgroundColor = academicRanks.map((rank) => rank.color);

			// Update total population in title
			if (chart.options.plugins?.title) {
				chart.options.plugins.title.text = `Faculty Population: ${totalPopulation}`;
			}

			chart.update();
		}
	});
</script>

<div class="relative h-auto w-52">
	<canvas id="nestedPieChart" bind:this={ctx}></canvas>

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
