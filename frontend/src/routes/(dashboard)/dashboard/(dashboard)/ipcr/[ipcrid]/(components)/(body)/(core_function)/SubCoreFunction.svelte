<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { ChevronDown, Plus } from 'lucide-svelte';
	import SubCoreFunctionCreateDialog from './(subcomponents)/(create_dialogs)/SubCoreFunctionCreateDialog.svelte';
	import CoreFunctionIndicator from './CoreFunctionIndicator.svelte';
	import DeleteActionCoreFunction from './(subcomponents)/(delete_actions)/DeleteActionCoreFunction.svelte';
	import DropDownWrapper from './(subcomponents)/DropDownWrapper.svelte';
	import CoreFunctionUpdateDialog from './(subcomponents)/(update_dialogs)/CoreFunctionUpdateDialog.svelte';
	import type { Tables } from '$lib/types/database.types';

	let {
		name,
		units,
		coreFunctionId
	}: { name: string; units?: number | null; coreFunctionId: string } = $props();

	let isExpanded: boolean = $state(false);
	let isDrawerOpen: boolean = $state(false);

	const toggleExpand = () => {
		isExpanded = !isExpanded;
	};

	interface SubCoreFunctionResponse {
		data: Tables<'sub_core_function'>[];
		error?: string;
	}

	async function fetchSubCoreFunctions(
		coreFunctionId: string
	): Promise<Tables<'sub_core_function'>[]> {
		try {
			const response = await fetch(`/api/sub_core_function?core_function_id=${coreFunctionId}`);
			const result: SubCoreFunctionResponse = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to fetch sub core functions');
			}

			return result.data;
		} catch (error) {
			console.error('Error fetching sub core functions:', error);
			throw error;
		}
	}
</script>

<div class="rounded-lg border">
	<div class="flex min-h-[4rem] items-center justify-between p-4">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" onclick={toggleExpand}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<div>
				<h3 class="text-sm font-semibold md:text-base">{name}</h3>
				<p class="text-muted-foreground text-xs md:text-sm">({!units ? ' _' : units} units)</p>
			</div>
		</div>
		{#snippet deleteAction()}
			<DeleteActionCoreFunction id={coreFunctionId} bind:isDrawerOpen />
		{/snippet}
		{#snippet updateDialog()}
			<CoreFunctionUpdateDialog {coreFunctionId} bind:isDrawerOpen />
		{/snippet}
		<div class="flex gap-4">
			<SubCoreFunctionCreateDialog {coreFunctionId} />
			<DropDownWrapper {deleteAction} {updateDialog} bind:isDrawerOpen />
		</div>
	</div>

	{#if isExpanded}
		<div class="relative space-y-4 px-4 pt-4 md:pl-14 md:pr-10">
			{#await fetchSubCoreFunctions(coreFunctionId)}
				loading...
			{:then data}
				{#if data.length === 0}
				<h1>No Sub-core functions found</h1>
				{:else}
				{#each data as d (d.id)}
					<CoreFunctionIndicator name={d.name} />
				{/each}
				{/if}
			{/await}
		</div>
		<!-- <div class="border-t p-4">
			<div class="space-y-4">
				<h1>No Sub-core functions found</h1>
			</div>
		</div> -->
	{/if}
</div>
