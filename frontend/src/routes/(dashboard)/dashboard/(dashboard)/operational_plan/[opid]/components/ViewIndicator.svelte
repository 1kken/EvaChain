<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Tables } from '$lib/types/database.types';
	import TruncatedDiv from '../../../components/TruncatedDiv.svelte';
	import { getOpIndicatorStore } from '../states/op_indicator_state';
	import ActivityHeader from './sub_components/view_indicator/ActivityHeader.svelte';
	import DetailsSection from './sub_components/view_indicator/DetailsSection.svelte';
	import StatusSection from './sub_components/view_indicator/StatusSection.svelte';
	import TimestampSection from './sub_components/view_indicator/TimestampSection.svelte';

	let { indicator }: { indicator: Tables<'op_activity_indicator'> } = $props();
	const { currentOpIndicators } = getOpIndicatorStore();
	// Create reactive state using runes
	let currentIndicator = $state(indicator);

	let progress = $state({
		q1: indicator.q1_target,
		q2: indicator.q2_target,
		q3: indicator.q3_target,
		q4: indicator.q4_target
	});

	let itemDetail = $state({
		responsible_officer_unit: indicator.responsible_officer_unit,
		total_budgetary_requirements: indicator.total_budgetary_requirements
	});

	// Update state reactively when activity changes
	$effect(() => {
		const updatedIndicator = $currentOpIndicators.find((activity) => activity.id === indicator.id);

		if (updatedIndicator) {
			currentIndicator = updatedIndicator;

			// Update progress state
			progress = {
				q1: updatedIndicator.q1_target,
				q2: updatedIndicator.q2_target,
				q3: updatedIndicator.q3_target,
				q4: updatedIndicator.q4_target
			};

			// Update item details state
			itemDetail = {
				responsible_officer_unit: indicator.responsible_officer_unit,
				total_budgetary_requirements: indicator.total_budgetary_requirements
			};
		}
	});
</script>

<Dialog.Root>
	<Dialog.Trigger class="hover:underline focus-visible:outline-none">
		<TruncatedDiv text={indicator.performance_indicator} maxLength={50} />
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<div class="mx-auto max-w-4xl space-y-8">
			<!-- Header Section -->
			<ActivityHeader indicator={currentIndicator.performance_indicator} />

			<!-- Status Section -->
			<StatusSection {progress} formerState={currentIndicator.former_state} />

			<DetailsSection {itemDetail} />

			<!-- Timestamp Section -->
			<TimestampSection
				createdAt={currentIndicator.created_at}
				updatedAt={currentIndicator.updated_at}
			/>
		</div>
	</Dialog.Content>
</Dialog.Root>
