<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { showWarningToast } from '$lib/utils/toast';
	import TruncatedDiv from '../../../components/TruncatedDiv.svelte';
	import { getOpIndicatorFormContext } from '../states/op_indicator_form_state';
	import { getOpIndicatorStore } from '../states/op_indicator_state';
	import UpdateDialog from './sub_components/op_indicator/UpdateDialog.svelte';

	let { opIndicator }: { opIndicator: Tables<'op_activity_indicator'> } = $props();
	//states
	let isDrawerOpen = $state(false);

	//store
	const { deleteForm } = getOpIndicatorFormContext();
	const { removeOpIndicator } = getOpIndicatorStore();

	//functions
	function handleDelete(result: { type: string; data: any }) {
		if (result.data.opIndicator) {
			const opIndicator = result.data.opIndicator;
			removeOpIndicator(opIndicator.id);
			showWarningToast(`Successfully deleted ${opIndicator.performance_indicator}`);
		}
	}
</script>

<div class="rounded-lg border">
	<header class=" top-0 flex h-10 items-center justify-between p-7 md:px-10">
		<div class="flex items-center gap-2">
			<Badge variant={'secondary'} class="h-5 bg-amber-500 text-xs">Activity</Badge>
			<div class="min-w-0 flex-1">
				<TruncatedDiv text={opIndicator.performance_indicator} maxLength={50} />
			</div>
		</div>
		<div class="flex items-center gap-5">
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={opIndicator.id}
					action="?/deleteopindicator"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateAction()}
				<UpdateDialog bind:isDrawerOpen {opIndicator} />
			{/snippet}
			<div class="flex gap-4">
				<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
			</div>
		</div>
	</header>
</div>
