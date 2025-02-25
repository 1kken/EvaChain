<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Tables } from '$lib/types/database.types';
	import Accomplishment from './sub-components/view_indicator/Accomplishment.svelte';
	import Header from './sub-components/view_indicator/Header.svelte';
	import Rating from './sub-components/view_indicator/Rating.svelte';
	import TimeStamp from './sub-components/view_indicator/TimeStamp.svelte';

	interface Props {
		currentIndicator: Tables<'ipcr_indicator'>;
	}

	let { currentIndicator }: Props = $props();
	// Props
</script>

<Dialog.Root>
	<Dialog.Trigger class="focus-visible:outline-none">
		<span class="text-sm hover:underline">
			{currentIndicator.success_indicator}
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<div class="mx-auto max-w-4xl space-y-8">
			<!-- Header Section -->
			<Header
				finalOutput={currentIndicator.final_output}
				successIndicator={currentIndicator.success_indicator}
			/>

			<!-- Rating Section -->
			<Rating
				qualityRating={currentIndicator.quality_rating ?? 0}
				efficiencyRating={currentIndicator.efficiency_rating ?? 0}
				timelinessRating={currentIndicator.timeliness_rating ?? 0}
				averageRating={currentIndicator.average_rating ?? 0}
				units={currentIndicator.units ?? 0}
			/>

			<!-- Accomplishment Section -->
			<Accomplishment remarks={currentIndicator.remarks ?? 'No remarks'} />

			<!-- Timestamp Section -->
			<TimeStamp createdAt={currentIndicator.created_at} updatedAt={currentIndicator.updated_at} />
		</div>
	</Dialog.Content>
</Dialog.Root>
