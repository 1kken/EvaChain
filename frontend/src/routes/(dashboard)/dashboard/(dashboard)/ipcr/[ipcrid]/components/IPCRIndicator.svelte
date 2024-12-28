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
	import MarkAsDone from './sub_components/ipcr_indicator/MarkAsDone.svelte';
	import UpdateDialog from './sub_components/ipcr_indicator/UpdateDialog.svelte';
	// import { getSingleIPCRStore } from '../(data)/(state)/ipcr-state.svelte';
	// import DropDownWrapper from '../(wrappers)/DropDownWrapper.svelte';
	// import DeleteIndicatorAction from './DeleteIndicatorAction.svelte';
	// import MarkAsDoneDialog from './MarkAsDoneDialog.svelte';
	// import UpdateIndicatorDialog from './UpdateIndicatorDialog.svelte';

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
	const { canEdit } = getIpcrStore();
</script>

<div class="rounded-lg border">
	<div class="h-13 flex flex-col space-y-2 p-4">
		<div class="w-full sm:w-auto">
			{#if ipcrFunctionIndicator.status !== 'submitted' && !$canEdit}
				<MarkAsDone indicator={ipcrFunctionIndicator} bind:isDrawerOpen />
			{/if}
		</div>
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-2">
				<Badge variant={'secondary'} class="h-5 text-xs">Indicator</Badge>
				<h4 class="text-sm">{ipcrFunctionIndicator.success_indicator}</h4>
			</div>
			<div>
				{#if $canEdit}
					{#snippet deleteAction()}
						<UniversalDeleteAction
							id={ipcrFunctionIndicator.id}
							action="?/deleteipcrindicator"
							data={deleteForm}
							onDelete={handleDelete}
						/>
					{/snippet}
					{#snippet updateDialog()}
						<UpdateDialog {ipcrFunctionIndicator} bind:isDrawerOpen />
					{/snippet}
					<DropDownWrapper childrens={[updateDialog, deleteAction]} bind:isDrawerOpen />
				{/if}
			</div>
		</div>
	</div>
</div>
