<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import type { Tables } from '$lib/types/database.types';
	import ViewIndicator from './view-indicator.svelte';

	interface Props {
		ipcrIndicator: Tables<'ipcr_indicator'>;
	}
	let { ipcrIndicator }: Props = $props();
	let isDrawerOpen = $state(false);

	// <div>
	// 	{#snippet updateDialog()}
	// 		<UpdateDialog {ipcrFunctionIndicator} bind:isDrawerOpen />
	// 	{/snippet}

	// 	<!-- This when the user can literally edit anything-->
	// 	{#if canEditIndicator}
	// 		{#snippet deleteAction()}
	// 			<UniversalDeleteAction
	// 				id={ipcrFunctionIndicator.id}
	// 				action="?/deleteipcrindicator"
	// 				data={deleteForm}
	// 				onDelete={handleDelete}
	// 			/>
	// 		{/snippet}
	// 		<DropDownWrapper childrens={[updateDialog, deleteAction]} bind:isDrawerOpen />
	// 	{/if}

	// 	<!-- This when the user can edit but cannot delete-->
	// 	{#if canEditButCannotDelete}
	// 		<DropDownWrapper childrens={[updateDialog]} bind:isDrawerOpen />
	// 	{/if}
	// </div>
</script>

<div class="rounded-lg border">
	<div class="h-13 flex flex-col space-y-2 p-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-2">
				<Badge variant={'secondary'} class="h-5 bg-amber-500 text-xs">Indicator</Badge>
				<ViewIndicator currentIndicator={ipcrIndicator} />
			</div>
		</div>
	</div>
</div>
