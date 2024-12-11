<script lang="ts">
	import type { Tables } from '$lib/types/database.types';
	import DropDownWrapper from '../(helpers)/DropDownWrapper.svelte';
	import DeleteIndicatorAction from './DeleteIndicatorAction.svelte';
	import UpdateIndicatorDialog from './UpdateIndicatorDialog.svelte';
	import { getCoreFunctionStore } from '../(data)/(state)/corefunctionstate.svelte';

	let { indicator }: { indicator: Tables<'indicator'> } = $props();
	let isDrawerOpen = $state(false);
	const { currentIPCRid } = getCoreFunctionStore();
</script>

<div class="rounded-lg border">
	<div class="flex min-h-[3.5rem] items-center justify-between p-3">
		<div class="flex items-center gap-2">
			<h4 class=" text-base">{indicator.indicator}</h4>
		</div>
		{#snippet deleteAction()}
			<DeleteIndicatorAction {indicator} bind:isDrawerOpen />
		{/snippet}
		{#snippet updateDialog()}
			<UpdateIndicatorDialog {indicator} bind:isDrawerOpen />
		{/snippet}
		<!-- {#snippet submitDialog()}
			<span class="flex items-center gap-3 text-sm">
				<Send size={16} />
				Submit
			</span>
		{/snippet} -->
		<DropDownWrapper childrens={[deleteAction, updateDialog]} bind:isDrawerOpen />
	</div>
</div>
