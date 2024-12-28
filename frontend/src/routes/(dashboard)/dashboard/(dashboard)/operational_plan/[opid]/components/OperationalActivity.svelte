<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { showWarningToast } from '$lib/utils/toast';
	import { getOpActivityFormContext } from '../states/op_activity_form_state';
	import { getOpActivityStore } from '../states/op_activity_state';
	import UpdateDialog from './sub_components/op_activity/UpdateDialog.svelte';
	import ViewActivity from './ViewActivity.svelte';

	let { opActivity }: { opActivity: Tables<'op_activity'> } = $props();
	//states
	let isDrawerOpen = $state(false);

	//store
	const { removeOpActivity } = getOpActivityStore();
	const { deleteForm } = getOpActivityFormContext();

	//functions
	function handleDelete(result: { type: string; data: any }) {
		if (result.data.opActivity) {
			const opActivity = result.data.opActivity;
			removeOpActivity(opActivity.id);
			showWarningToast(`Successfully deleted ${opActivity.activity}`);
		}
	}
</script>

<div class="rounded-lg border">
	<header class=" top-0 flex h-10 items-center justify-between px-4 md:px-10">
		<div class="flex items-center gap-5">
			<Badge variant={'secondary'} class="h-5 text-xs">Activity</Badge>
			<h2 class="text-sm"><ViewActivity activity={opActivity} /></h2>
		</div>
		<div class="flex items-center gap-5">
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={opActivity.id}
					action="?/deleteopactivity"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateAction()}
				<UpdateDialog bind:isDrawerOpen {opActivity} />
			{/snippet}
			<div class="flex gap-4">
				<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
			</div>
		</div>
	</header>
</div>
