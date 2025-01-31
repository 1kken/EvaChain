<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { showWarningToast } from '$lib/utils/toast';
	import TruncatedDiv from '../../../components/TruncatedDiv.svelte';
	import { getOpcrIndicatorFormContext } from '../states/indicator_form_state';
	import { getOpcrIndicatorStore } from '../states/indicator_state';
	import type { OPCRIndicatorFormResult } from '../utils/types';
	import Update from './sub_component/indicator/update.svelte';

	let { opcrIndicator }: { opcrIndicator: Tables<'opcr_indicator'> } = $props();
	let isDrawerOpen = $state(false);

	//store
	const { deleteForm } = getOpcrIndicatorFormContext();
	const { removeOpcrIndicator } = getOpcrIndicatorStore();

	function handleDelete(result: { type: string; data: OPCRIndicatorFormResult }) {
		if (result.data.opcrIndicator) {
			const opcrIndicatorResult = result.data.opcrIndicator;
			removeOpcrIndicator(opcrIndicatorResult.id);
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
				<TruncatedDiv text={opcrIndicator.success_indicator} maxLength={50} />
			</div>
			<div>
				{#snippet deleteAction()}
					<UniversalDeleteAction
						id={opcrIndicator.id}
						action="?/deleteindicator"
						data={deleteForm}
						onDelete={handleDelete}
					/>
				{/snippet}
				{#snippet updateDialog()}
					<Update {opcrIndicator} bind:isDrawerOpen />
				{/snippet}
				<DropDownWrapper childrens={[updateDialog, deleteAction]} bind:isDrawerOpen />
			</div>
		</div>
	</div>
</div>
