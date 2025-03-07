<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, PieController, ArcElement } from 'chart.js';
	import type { ChartItem } from 'chart.js';

	let chartCanvas: ChartItem;

	onMount(() => {
		Chart.register(PieController, ArcElement);

		new Chart(chartCanvas, {
			type: 'pie',
			data: {
				labels: ['Red', 'Blue', 'Yellow'],
				datasets: [
					{
						label: 'Dataset',
						data: [300, 150, 100],
						backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
						hoverOffset: 4
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false
			}
		});
	});
</script>

<canvas bind:this={chartCanvas}></canvas>
