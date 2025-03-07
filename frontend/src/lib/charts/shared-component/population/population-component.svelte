<script lang="ts">
	import woman from '$lib/assets/icons/women.png';
	import man from '$lib/assets/icons/man.png';
	import * as Card from '$lib/components/ui/card/index.js';
	import { getSharedChartStore } from '../state';
	let { populationData } = getSharedChartStore();

	let { population, malePopulation, femalePopulation, titleName } = $populationData || {
		population: 0,
		malePopulation: 0,
		femalePopulation: 0,
		titleName: ''
	};
</script>

<div class="w-fit max-w-4xl">
	<!-- Mobile layout (stacked) -->
	<div class="grid grid-cols-1 gap-4 sm:hidden">
		<Card.Root class="border-none">
			<Card.Content class="py-4 text-center">
				<h1 class="text-5xl font-bold">{population}</h1>
			</Card.Content>
		</Card.Root>

		<div class="grid grid-cols-2 gap-2">
			<Card.Root class="border-none">
				<Card.Content class="flex flex-col items-center py-4">
					<h2 class="text-3xl font-semibold">{malePopulation}</h2>
					<span class="text-sm">Male</span>
				</Card.Content>
			</Card.Root>

			<Card.Root class="border-none">
				<Card.Content class="flex flex-col items-center py-4">
					<h2 class="text-3xl font-semibold">{femalePopulation}</h2>
					<span class="text-sm">Female</span>
				</Card.Content>
			</Card.Root>
		</div>

		{#if $populationData}
			<h1 class="p-2 text-center text-2xl">{titleName} Population</h1>
		{:else}
			<h1 class="p-2 text-center text-2xl">Population data is not available.</h1>
		{/if}
	</div>

	<!-- Desktop/tablet layout (horizontal) -->
	<div class="hidden sm:block">
		<Card.Root class="border-none">
			<Card.Content class="py-6">
				<div class="flex flex-col space-y-4">
					<div class="flex items-center justify-between space-x-8">
						<div class="text-center">
							<h1 class="text-5xl font-bold">{population}</h1>
							<h3 class="text-sm">Total Population</h3>
						</div>

						<div class="flex items-center space-x-2">
							<img src={man} alt="Man icon" class="h-24 w-24 md:h-36 md:w-36" />
							<h2 class="text-3xl font-semibold md:text-4xl">{malePopulation}</h2>
						</div>

						<div class="flex items-center space-x-2">
							<img src={woman} alt="Woman icon" class="h-24 w-24 md:h-36 md:w-36" />
							<h2 class="text-3xl font-semibold md:text-4xl">{femalePopulation}</h2>
						</div>
					</div>

					<div class="text-center text-sm">
						{#if $populationData}
							<h1 class="text-2xl">{titleName} Population</h1>
						{:else}
							<h1 class="text-2xl">Population data is not available.</h1>
						{/if}
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
