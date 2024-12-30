<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Tables } from '$lib/types/database.types';
	import { getOpActivityStore } from '../states/op_activity_state';
	import ActivityHeader from './sub_components/view_activity/ActivityHeader.svelte';
	import DetailsSection from './sub_components/view_activity/DetailsSection.svelte';
	import StatusSection from './sub_components/view_activity/StatusSection.svelte';
	import TimestampSection from './sub_components/view_activity/TimestampSection.svelte';

	let { activity }: { activity: Tables<'op_activity'> } = $props();
	const { currentOpActivities } = getOpActivityStore();

	// Create reactive state using runes
	let currentActivity = $state(activity);
	let progress = $state({
		q1: activity.q1,
		q2: activity.q2,
		q3: activity.q3,
		q4: activity.q4
	});
	let itemDetail = $state({
		item: activity.item,
		unit: activity.unit,
		qty: activity.qty,
		unit_cost: activity.unit_cost,
		amount: activity.amount,
		fundSource: activity.fund_source
	});

	// Update state reactively when activity changes
	$effect(() => {
		const updatedActivity = $currentOpActivities.find(
			(opActivity) => opActivity.id === activity.id
		);

		if (updatedActivity) {
			currentActivity = updatedActivity;

			// Update progress state
			progress = {
				q1: updatedActivity.q1,
				q2: updatedActivity.q2,
				q3: updatedActivity.q3,
				q4: updatedActivity.q4
			};

			// Update item details state
			itemDetail = {
				item: updatedActivity.item,
				unit: updatedActivity.unit,
				qty: updatedActivity.qty,
				unit_cost: updatedActivity.unit_cost,
				amount: updatedActivity.amount,
				fundSource: updatedActivity.fund_source
			};
		}
	});
</script>

<Dialog.Root>
	<Dialog.Trigger class="focus-visible:outline-none">
		<span class=" text-sm hover:underline">
			{currentActivity.activity}
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<div class="mx-auto max-w-4xl space-y-8">
			<!-- Header Section -->
			<ActivityHeader indicator={currentActivity.indicator} activity={currentActivity.activity} />

			<!-- Status Section -->
			<StatusSection
				{progress}
				formerState={currentActivity.former_state}
				desiredState={currentActivity.desired_state}
			/>

			{#if currentActivity.item}
				<!-- Details Section -->
				<DetailsSection {itemDetail} />
			{/if}

			<!-- Timestamp Section -->
			<TimestampSection
				createdAt={currentActivity.created_at}
				updatedAt={currentActivity.updated_at}
			/>
		</div>
	</Dialog.Content>
</Dialog.Root>
