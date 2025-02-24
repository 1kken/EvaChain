<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { showWarningToast } from '$lib/utils/toast';
	import { getIpcrStore } from '../states/current_ipcr_state';
	import { getIpcrIndicatorFormContext } from '../states/ipcr_indicator_form_state';
	import { getIpcrIndicatorStore } from '../states/ipcr_indicator_state';
	import type { IPCRFunctionIndicatorFormResult } from '../utils/types';
	import UpdateDialog from './sub_components/ipcr_indicator/UpdateDialog.svelte';
	import ViewIndicator from './ViewIndicator.svelte';
	let { ipcrFunctionIndicator }: { ipcrFunctionIndicator: Tables<'ipcr_indicator'> } = $props();
	let isDrawerOpen = $state(false);
	//store
	const { deleteForm } = getIpcrIndicatorFormContext();
	const { removeIpcrIndicator } = getIpcrIndicatorStore();

	function handleDelete(result: { type: string; data: IPCRFunctionIndicatorFormResult }) {
		if (result.data.ipcrFunctionIndicator) {
			const ipcrFunctionIndicator = result.data.ipcrFunctionIndicator;
			removeIpcrIndicator(ipcrFunctionIndicator.id);
			showWarningToast(`Successfully deleted indicator`);
		}
	}
	const { isDraft, isRevisionRaw, isReviewedRaw, isRevision } = getIpcrStore();
	//* This is where ther user can edit the indicator as a whole edit delete
	let canEditIndicator = $state($isDraft || $isRevisionRaw);

	//* This is where the user can edit the indicator but cannot delete
	let canEditButCannotDelete = $state($isRevision || $isReviewedRaw);
</script>

<div class="rounded-lg border">
	<div class="h-13 flex flex-col space-y-2 p-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-2">
				<Badge variant={'secondary'} class="h-5 bg-amber-500 text-xs">Indicator</Badge>
				<ViewIndicator ipcrId={ipcrFunctionIndicator.id} />
			</div>
			<div>
				{#snippet updateDialog()}
					<UpdateDialog {ipcrFunctionIndicator} bind:isDrawerOpen />
				{/snippet}

				<!-- This when the user can literally edit anything-->
				{#if canEditIndicator}
					{#snippet deleteAction()}
						<UniversalDeleteAction
							id={ipcrFunctionIndicator.id}
							action="?/deleteipcrindicator"
							data={deleteForm}
							onDelete={handleDelete}
						/>
					{/snippet}
					<DropDownWrapper childrens={[updateDialog, deleteAction]} bind:isDrawerOpen />
				{/if}

				<!-- This when the user can edit but cannot delete-->
				{#if canEditButCannotDelete}
					<DropDownWrapper childrens={[updateDialog]} bind:isDrawerOpen />
				{/if}
			</div>
		</div>
	</div>
</div>
