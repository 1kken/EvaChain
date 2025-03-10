<script lang="ts">
	import { getHeadsChartStore } from '$lib/charts/head_of_op-vice_president/state';
	import * as Card from '$lib/components/ui/card/index.js';
	import AcademicBarchartAccomplishment from '$lib/charts/head_of_op-vice_president/head_of_operating_unit/academic-accomplishment/academic-barchart-accomplishment.svelte';
	import AcAcademicSelect from './components/accomplishment/ac-academic-select.svelte';
	import AcademicBarchartAccomplishmentHistory from '$lib/charts/head_of_op-vice_president/head_of_operating_unit/academic-accomplishment/academic-barchart-accomplishment-history.svelte';
	import NonAcademicBarchartAccomplishment from '$lib/charts/head_of_op-vice_president/head_of_operating_unit/tech-admin-accomplishment/non-academic-barchart-accomplishment.svelte';
	import NonAcademicBarchartAccomplishmentHistory from '$lib/charts/head_of_op-vice_president/head_of_operating_unit/tech-admin-accomplishment/non-academic-barchart-accomplishment-history.svelte';
	import AcNonAcademicSelect from './components/accomplishment/ac-non-academic-select.svelte';

	const { currentAcademicAccomplishmentAnalysis, currentNonAcademicAccomplishmentAnalysis } =
		getHeadsChartStore();
</script>

<Card.Root class="h-full w-full border-none">
	<Card.Content class="border-none">
		<div class="flex flex-col gap-4 md:flex-row">
			<div class="h-48 w-full md:w-1/2">
				<div class="flex items-center gap-2">
					<h1 class="font-semibold">Tech and Admin Accomplishment Analysis</h1>
					<AcNonAcademicSelect />
				</div>
				{#if !$currentNonAcademicAccomplishmentAnalysis}
					<NonAcademicBarchartAccomplishment />
				{:else}
					<NonAcademicBarchartAccomplishmentHistory />
				{/if}
			</div>
			<div class="h-48 w-full md:w-1/2">
				<div class="flex items-center gap-2">
					<h1 class="font-semibold">Academic Offices Accomplishment Analysis</h1>
					<AcAcademicSelect />
				</div>
				{#if !$currentAcademicAccomplishmentAnalysis}
					<AcademicBarchartAccomplishment />
				{:else}
					<AcademicBarchartAccomplishmentHistory />
				{/if}
			</div>
		</div>
	</Card.Content>
</Card.Root>
