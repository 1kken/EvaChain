<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Tables } from '$lib/types/database.types';
	import { getAccomplishmentActivityStore } from '../states/activity_state';
	import ActivityHeader from './sub_components/view_activity/ActivityHeader.svelte';
	import DetailsSection from './sub_components/view_activity/DetailsSection.svelte';
	import StatusSection from './sub_components/view_activity/StatusSection.svelte';
	import TimestampSection from './sub_components/view_activity/TimestampSection.svelte';

	let { activity }: { activity: Tables<'accomplishment_activity'> } = $props();
	const { currentAccomplishmentActivities } = getAccomplishmentActivityStore();
	// const { currentOpActivities } = getOpActivityStore();

	// Create reactive state using runes
	let currentActivity = $state(activity);

	let progress = $state({
		q1: activity.q1_accomplishment,
		q2: activity.q2_accomplishment,
		q3: activity.q3_accomplishment,
		q4: activity.q4_accomplishment
	});

	let itemDetail = $state({
		responsible_officer_unit: activity.responsible_officer_unit,
		accomplishmentRate: activity.accomplishment_rate,
		remarks: activity.remarks
	});

	// Update state reactively when activity changes
	$effect(() => {
		const updatedActivity = $currentAccomplishmentActivities.find(
			(accActivity) => accActivity.id === activity.id
		);

		if (updatedActivity) {
			currentActivity = updatedActivity;

			// Update progress state
			progress = {
				q1: activity.q1_accomplishment,
				q2: activity.q2_accomplishment,
				q3: activity.q3_accomplishment,
				q4: activity.q4_accomplishment
			};

			itemDetail = {
				responsible_officer_unit: activity.responsible_officer_unit,
				accomplishmentRate: activity.accomplishment_rate,
				remarks: activity.remarks
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
			<ActivityHeader
				indicator={currentActivity.performance_indicator}
				activity={currentActivity.activity}
			/>

			<!-- Status Section -->
			<StatusSection
				{progress}
				total={currentActivity.total}
				annualTarget={currentActivity.annual_target}
			/>

			<DetailsSection {itemDetail} />

			<!-- Timestamp Section -->
			<TimestampSection
				createdAt={currentActivity.created_at}
				updatedAt={currentActivity.updated_at}
			/>
		</div>
	</Dialog.Content>
</Dialog.Root>
