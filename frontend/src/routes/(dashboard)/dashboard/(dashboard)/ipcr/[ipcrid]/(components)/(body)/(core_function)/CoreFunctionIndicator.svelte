<script lang="ts">
	import { ChevronDown, Plus } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import SubCoreFunctionIndicatorCreateDialog from './(subcomponents)/(create_dialogs)/SubCoreFunctionIndicatorCreateDialog.svelte';
	import DeleteActionSubCoreFunction from './(subcomponents)/(delete_actions)/DeleteActionSubCoreFunction.svelte';
	import SubCoreFunction from './SubCoreFunction.svelte';
	import DropDownWrapper from './(subcomponents)/DropDownWrapper.svelte';
	import SubCoreFunctionUpdateDialog from './(subcomponents)/(update_dialogs)/SubCoreFunctionUpdateDialog.svelte';

	interface Props {
		name: string;
		sub_core_function_id: string;
	}
	// Props
	let { name, sub_core_function_id }: Props = $props();

	// States
	let isExpanded: boolean = $state(false);
	let isDrawerOpen = $state(false);
	let targets: number[] = $state([0]); // Initialize with one target

	/** Toggle expansion */
	const toggleExpand = () => {
		isExpanded = !isExpanded;
	};
</script>

<div class="rounded-lg border">
	<div class="flex min-h-[3.5rem] items-center justify-between p-3">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" class="hidden md:flex" onclick={toggleExpand}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<h4 class="font-medium">{name}</h4>
		</div>

		{#snippet deleteAction()}
			<DeleteActionSubCoreFunction subCoreFunctionId={sub_core_function_id} bind:isDrawerOpen />
		{/snippet}
		{#snippet updateDialog()}
			<SubCoreFunctionUpdateDialog subCoreFunctionId={sub_core_function_id} bind:isDrawerOpen />
		{/snippet}
		<div class="flex gap-4">
			<SubCoreFunctionIndicatorCreateDialog />
			<DropDownWrapper {deleteAction} {updateDialog} bind:isDrawerOpen />
		</div>
	</div>

	{#if isExpanded}
		<div class="border-t p-3">
			{#each targets as index}
				{index}
			{/each}
		</div>
	{/if}
</div>
