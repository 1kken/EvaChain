<script lang="ts">
	import TeachingEffectivenessHistoryHopu from '$lib/charts/head_of_op-vice_president/head_of_operating_unit/teaching-effectiveness/teaching-effectiveness-history-hopu.svelte';
	import TeachingEffectivenessHopu from '$lib/charts/head_of_op-vice_president/head_of_operating_unit/teaching-effectiveness/teaching-effectiveness-hopu.svelte';
	import { getHeadsChartStore } from '$lib/charts/head_of_op-vice_president/state';
	import * as Card from '$lib/components/ui/card/index.js';
	import TeAcademicSelect from './components/teaching-effectiveness/te-academic-select.svelte';

	let { teCurrentAcademicOffice, currentNonAcademicOffice } = getHeadsChartStore();
</script>

<Card.Root class="h-full w-full border-none">
	<Card.Content class="border-none">
		<div class="flex flex-col gap-4 md:flex-row">
			<!--Faculty Teaching effectiveness-->
			<div class="h-48 w-full md:w-1/2">
				<div class="flex items-center gap-2">
					<h1 class="font-semibold">Faculty Teaching Effectiveness</h1>
					<TeAcademicSelect />
				</div>
				{#if !$teCurrentAcademicOffice}
					<TeachingEffectivenessHopu />
				{:else}
					<TeachingEffectivenessHistoryHopu />
				{/if}
			</div>
		</div>
	</Card.Content>
</Card.Root>
