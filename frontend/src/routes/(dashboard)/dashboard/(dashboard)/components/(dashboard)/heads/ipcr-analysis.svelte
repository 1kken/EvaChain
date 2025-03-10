<script lang="ts">
	import TechAdminHopu from '$lib/charts/head_of_op-vice_president/head_of_operating_unit/tech-admin-ipcr-analysis/tech-admin-hopu.svelte';
	import TechAdminHistory from '$lib/charts/head_of_op-vice_president/head_of_operating_unit/tech-admin-ipcr-analysis/tech-admin-history.svelte';
	import { getHeadsChartStore } from '$lib/charts/head_of_op-vice_president/state';
	import * as Card from '$lib/components/ui/card/index.js';
	import AcademicHopu from '$lib/charts/head_of_op-vice_president/head_of_operating_unit/academic-ipcr-analysis/academic-hopu.svelte';
	import IpcrAcademicSelection from './components/ipcr-analysis/ipcr-academic-selection.svelte';
	import IpcrNonAcademicSelection from './components/ipcr-analysis/ipcr-non-academic-selection.svelte';
	import AcademicHistory from '$lib/charts/head_of_op-vice_president/head_of_operating_unit/academic-ipcr-analysis/academic-history.svelte';

	let { currentNonAcademicIpcrAnalysis, currentAcademicIpcrAnalysis } = getHeadsChartStore();
</script>

<Card.Root class="h-full w-full border-none">
	<Card.Content class="border-none">
		<div class="flex flex-col gap-4 md:flex-row">
			<div class="h-48 w-full md:w-1/2">
				<div class="flex items-center gap-2">
					<h1 class="font-semibold">Tech and Admin Offices IPCR Analysis</h1>
					<IpcrNonAcademicSelection />
				</div>
				{#if !$currentNonAcademicIpcrAnalysis}
					<TechAdminHopu />
				{:else}
					<TechAdminHistory />
				{/if}
			</div>
			<div class="h-48 w-full md:w-1/2">
				<div class="flex items-center gap-2">
					<h1 class="font-semibold">Academic Offices IPCR Analysis</h1>
					<IpcrAcademicSelection />
				</div>
				{#if !$currentAcademicIpcrAnalysis}
					<AcademicHopu />
				{:else}
					<AcademicHistory />
				{/if}
			</div>
		</div>
	</Card.Content>
</Card.Root>
