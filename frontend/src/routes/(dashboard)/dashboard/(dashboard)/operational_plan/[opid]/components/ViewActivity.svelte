<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Tables } from '$lib/types/database.types';
	import ActivityHeader from './sub_components/view_activity/ActivityHeader.svelte';
	import DetailsSection from './sub_components/view_activity/DetailsSection.svelte';
	import StatusSection from './sub_components/view_activity/StatusSection.svelte';
	import TimestampSection from './sub_components/view_activity/TimestampSection.svelte';

	let { activity }: { activity: Tables<'op_activity'> } = $props();

	const progress = {
		q1: activity.q1,
		q2: activity.q2,
		q3: activity.q3,
		q4: activity.q4
	};

	const itemDetail = {
		item: activity.item,
		unit: activity.unit,
		qty: activity.qty,
		unit_cost: activity.unit_cost,
		amount: activity.amount,
		fundSource: activity.fund_source
	};
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<span class=" hover:underline">
			{activity.activity}
		</span>
	</Dialog.Trigger>
	<Dialog.Content>
		<div class="mx-auto max-w-4xl space-y-8">
			<!-- Header Section -->
			<ActivityHeader indicator={activity.indicator} activity={activity.activity} />

			<!-- Status Section -->
			<StatusSection
				{progress}
				formerState={activity.former_state}
				desiredState={activity.desired_state}
			/>

			{#if activity.item}
				<!-- Details Section -->
				<DetailsSection {itemDetail} />
			{/if}

			<!-- Timestamp Section -->
			<TimestampSection createdAt={activity.created_at} updatedAt={activity.updated_at} />
		</div>
	</Dialog.Content>
</Dialog.Root>
