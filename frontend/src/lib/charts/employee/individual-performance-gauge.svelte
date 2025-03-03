<!-- <script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
	import type { ChartItem } from 'chart.js';

	// Register required components
	Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

	interface Props {
		value?: number;
		maxValue?: number;
	}

	let { value = 4, maxValue = 5 }: Props = $props();

	// Function to get descriptive rating based on numerical value
	function getDescriptiveRating(val: number): string {
		if (val >= 5) return 'Outstanding';
		if (val >= 4) return 'Very Satisfactory';
		if (val >= 3) return 'Satisfactory';
		if (val >= 2) return 'Fair';
		if (val >= 1) return 'Poor';
		return 'Unrated';
	}

	let ctx: ChartItem;
	let chart: Chart;

	onMount(() => {
		// Calculate the percentage of the value relative to the max
		const percentage = (value / maxValue) * 100;

		// Create the gauge chart
		chart = new Chart(ctx, {
			type: 'doughnut',
			data: {
				datasets: [
					{
						data: [percentage, 100 - percentage],
						backgroundColor: [
							getColorForValue(value), // Filled portion - color based on rating
							'rgb(240, 240, 240)' // Empty portion
						],
						borderWidth: 0,
						circumference: 180, // Half circle
						rotation: 270 // Start from bottom
					}
				]
			},
			options: {
				cutout: '75%', // Thickness of the gauge
				plugins: {
					tooltip: {
						enabled: false // Disable tooltips
					},
					legend: {
						display: false // Hide legend
					}
				},
				// Define the center text
				elements: {
					arc: {
						borderWidth: 0
					}
				},
				layout: {
					padding: 20
				},
				maintainAspectRatio: false
			},
			plugins: [
				{
					id: 'centerText',
					afterDraw: (chart) => {
						const { ctx, width, height } = chart;
						ctx.save();
						ctx.textAlign = 'center';
						ctx.textBaseline = 'middle';

						// Draw the value
						ctx.font = 'bold 24px Arial';
						ctx.fillStyle = '#333';
						ctx.fillText(value.toString(), width / 2, height - height / 3 - 15);

						// Calculate percentage
						const percentage = Math.round((value / maxValue) * 100);
						ctx.font = '16px Arial';
						ctx.fillStyle = '#666';
						ctx.fillText(`${percentage}%`, width / 2, height - height / 3 + 10);

						// Draw the descriptive rating
						ctx.font = 'bold 16px Arial';
						ctx.fillStyle = '#333';
						ctx.fillText(getDescriptiveRating(value), width / 2, height - height / 3 + 35);

						ctx.restore();
					}
				}
			]
		});
	});

	// Function to get color based on numerical value
	function getColorForValue(val: number): string {
		if (val >= 5) return 'rgb(0, 128, 0)'; // Outstanding - Green
		if (val >= 4) return 'rgb(65, 105, 225)'; // Very Satisfactory - Royal Blue
		if (val >= 3) return 'rgb(54, 162, 235)'; // Satisfactory - Blue
		if (val >= 2) return 'rgb(255, 165, 0)'; // Fair - Orange
		if (val >= 1) return 'rgb(255, 99, 132)'; // Poor - Red
		return 'rgb(200, 200, 200)'; // Unrated - Gray
	}

	// Update chart when value changes
	$effect(() => {
		if (chart && value !== undefined) {
			const percentage = (value / maxValue) * 100;
			chart.data.datasets[0].data = [percentage, 100 - percentage];
			if (Array.isArray(chart.data.datasets[0].backgroundColor)) {
				chart.data.datasets[0].backgroundColor[0] = getColorForValue(value);
			}
			chart.update();
		}
	});
</script>

<div class="h-fit w-full">
	<canvas id="gaugeChart" bind:this={ctx}></canvas>
</div> -->
