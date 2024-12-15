<script lang="ts">
	import type { Tables } from '$lib/types/database.types';
	import { getSingleIPCRStore } from '../(data)/(state)/ipcr-state.svelte';
	import DropDownWrapper from '../(wrappers)/DropDownWrapper.svelte';
	import DeleteIndicatorAction from './DeleteIndicatorAction.svelte';
	import MarkAsDoneDialog from './MarkAsDoneDialog.svelte';
	import UpdateIndicatorDialog from './UpdateIndicatorDialog.svelte';

	let { indicator }: { indicator: Tables<'indicator'> } = $props();
	let isDrawerOpen = $state(false);

	const { canEdit } = getSingleIPCRStore();
</script>

<div class="rounded-lg border">
	<div class="flex flex-col space-y-2 p-3">
		<div class="w-full sm:w-auto">
			{#if indicator.status !== 'submitted' && !$canEdit}
				<MarkAsDoneDialog {indicator} bind:isDrawerOpen />
			{/if}
		</div>
		<div class="flex items-center justify-between">
			<h4 class="text-base">{indicator.indicator}</h4>
			<div>
				{#if $canEdit}
					{#snippet deleteAction()}
						<DeleteIndicatorAction {indicator} bind:isDrawerOpen />
					{/snippet}
					{#snippet updateDialog()}
						<UpdateIndicatorDialog {indicator} bind:isDrawerOpen />
					{/snippet}
					<DropDownWrapper childrens={[updateDialog, deleteAction]} bind:isDrawerOpen />
				{/if}
			</div>
		</div>
	</div>
</div>
