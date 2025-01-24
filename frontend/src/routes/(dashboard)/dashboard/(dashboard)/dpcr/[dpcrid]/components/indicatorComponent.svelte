<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { showWarningToast } from '$lib/utils/toast';
	import TruncatedDiv from '../../../components/TruncatedDiv.svelte';
	import { getDpcrIndicatorFormContext } from '../states/indicator_form_state';
	import { getDpcrIndicatorStore } from '../states/indicator_state';
	import type { DPCRIndicatorFormResult } from '../utils/types';
	import Update from './sub_component/indicator/update.svelte';

	let { dpcrIndicator }: { dpcrIndicator: Tables<'dpcr_indicator'> } = $props();
	let isDrawerOpen = $state(false);

	//store
	const { deleteForm } = getDpcrIndicatorFormContext();
	const { removeDpcrIndicator } = getDpcrIndicatorStore();

	function handleDelete(result: { type: string; data: DPCRIndicatorFormResult }) {
		if (result.data.dpcrIndicator) {
			const dpcrIndicatorResult = result.data.dpcrIndicator;
			removeDpcrIndicator(dpcrIndicatorResult.id);
			showWarningToast(`Successfully deleted indicator`);
		}
	}
</script>

<div class="h-auto rounded-lg border">
	<div class="flex h-auto flex-col justify-between">
		<div class="flex items-center justify-between p-2">
			<div class="flex flex-1 items-center gap-2">
				<Badge variant={'secondary'} class="h-5 whitespace-nowrap bg-amber-500 text-xs"
					>Indicator</Badge
				>
				<TruncatedDiv text={dpcrIndicator.success_indicator} maxLength={50} />
			</div>
			<div>
				{#snippet deleteAction()}
					<UniversalDeleteAction
						id={dpcrIndicator.id}
						action="?/deleteindicator"
						data={deleteForm}
						onDelete={handleDelete}
					/>
				{/snippet}
				{#snippet updateDialog()}
					<Update {dpcrIndicator} bind:isDrawerOpen />
				{/snippet}
				<DropDownWrapper childrens={[updateDialog, deleteAction]} bind:isDrawerOpen />
			</div>
		</div>
	</div>
</div>
