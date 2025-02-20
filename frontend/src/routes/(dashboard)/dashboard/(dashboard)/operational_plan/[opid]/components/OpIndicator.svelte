<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { showWarningToast } from '$lib/utils/toast';
	import { getOperationalPlanStore } from '../states/current_operational_plan_state';
	import { getOpIndicatorFormContext } from '../states/op_indicator_form_state';
	import { getOpIndicatorStore } from '../states/op_indicator_state';
	import UpdateDialog from './sub_components/op_indicator/UpdateDialog.svelte';
	import ViewIndicator from './ViewIndicator.svelte';

	let { opIndicator }: { opIndicator: Tables<'op_activity_indicator'> } = $props();
	//states
	let isDrawerOpen = $state(false);

	//store
	const { deleteForm } = getOpIndicatorFormContext();
	const { removeOpIndicator } = getOpIndicatorStore();
	const { canEdit } = getOperationalPlanStore();

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
		<div class="flex items-center gap-1">
			<Badge variant={'secondary'} class="h-5 bg-amber-500 text-xs">Indicator</Badge>
			<div class="flex items-center gap-2">
				<ViewIndicator indicator={opIndicator} />
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
			{#if $canEdit}
				<div class="flex gap-4">
					<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
				</div>
			{/if}
		</div>
	</header>
</div>
