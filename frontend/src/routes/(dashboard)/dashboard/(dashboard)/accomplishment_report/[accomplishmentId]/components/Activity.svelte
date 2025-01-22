<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { showWarningToast } from '$lib/utils/toast';
	import { getAccomplishmentActivityFormContext } from '../states/activity_form_state';
	import { getAccomplishmentActivityStore } from '../states/activity_state';
	import type { ActivityFormResult } from '../utils/type';
	import Update from './sub_components/activity/Update.svelte';
	import ViewActivity from './ViewActivity.svelte';

	let { activity }: { activity: Tables<'accomplishment_activity'> } = $props();
	//states
	let isDrawerOpen = $state(false);

	//store
	const { removeAccomplishmentActivity } = getAccomplishmentActivityStore();
	const { deleteForm } = getAccomplishmentActivityFormContext();
	//functions
	function handleDelete(result: { type: string; data: ActivityFormResult }) {
		if (result.data.accActivity) {
			const resActivity = result.data.accActivity;
			removeAccomplishmentActivity(resActivity.id);
			showWarningToast(`Successfully deleted ${resActivity.activity}`);
		}
	}
</script>

<div class="rounded-lg border">
	<header class=" top-0 flex h-10 items-center justify-between p-7 md:px-10">
		<div class="flex items-start gap-5 pr-4">
			<Badge variant={'secondary'} class="h-5 bg-amber-500 text-xs">Activity</Badge>
			<ViewActivity {activity} />
		</div>
		<div class="flex items-center gap-5">
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={activity.id}
					action="?/deleteactivity"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateAction()}
				<Update bind:isDrawerOpen {activity} />
			{/snippet}
			<div class="flex gap-4">
				<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
			</div>
		</div>
	</header>
</div>
