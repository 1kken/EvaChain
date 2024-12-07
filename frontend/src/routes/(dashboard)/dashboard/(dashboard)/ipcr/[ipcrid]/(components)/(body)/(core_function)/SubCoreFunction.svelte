<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { ChevronDown, Plus, LoaderCircle } from 'lucide-svelte';
	import { dndzone } from 'svelte-dnd-action';
	import type { DndEvent } from 'svelte-dnd-action';
	import debounce from 'debounce';
	import SubCoreFunctionCreateDialog from './(subcomponents)/(create_dialogs)/SubCoreFunctionCreateDialog.svelte';
	import CoreFunctionIndicator from './CoreFunctionIndicator.svelte';
	import DeleteActionCoreFunction from './(subcomponents)/(delete_actions)/DeleteActionCoreFunction.svelte';
	import DropDownWrapper from './(subcomponents)/DropDownWrapper.svelte';
	import CoreFunctionUpdateDialog from './(subcomponents)/(update_dialogs)/CoreFunctionUpdateDialog.svelte';
	import { setSubCoreFunctionStore } from '../../(data)/(state)/subcorefunctionstate.svelte';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import type { Tables } from '$lib/types/database.types';

	type SubCoreFunction = Tables<'sub_core_function'>;

	let {
		name,
		units,
		coreFunctionId
	}: { name: string; units?: number | null; coreFunctionId: string } = $props();

	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let isLoading = $state(false);
	let isUpdating = $state(false);
	let subFunctions = $state<SubCoreFunction[]>([]);
	let dndItems = $state<SubCoreFunction[]>([]);
	const flipDurationMs = 300;

	// Initialize store when component mounts
	const store = setSubCoreFunctionStore();
	const { currentSubCoreFunctions } = store;

	interface SubCoreFunctionResponse {
		data: Tables<'sub_core_function'>[];
		error?: string;
	}

	const updateSubCoreFunctionPositions = debounce(async (items: SubCoreFunction[]) => {
		try {
			const response = await fetch('/api/sub_core_function', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(items)
			});
			if (!response.ok) {
				throw new Error('Failed to update positions');
			}

			const result = await response.json();
			return result.data;
		} catch (error) {
			console.error('Error updating positions:', error);
			throw error;
		}
	}, 2000);

	function handleDndConsider(e: CustomEvent<DndEvent<SubCoreFunction>>) {
		const updatedItems = e.detail.items.map((item, index) => ({
			...item,
			position: (index + 1) * 100
		}));
		dndItems = updatedItems;
	}

	async function handleDndFinalize(e: CustomEvent<DndEvent<SubCoreFunction>>) {
		try {
			isUpdating = true;
			const updatedItems = e.detail.items.map((item, index) => ({
				...item,
				position: (index + 1) * 100
			}));

			await updateSubCoreFunctionPositions(updatedItems);
			$currentSubCoreFunctions = updatedItems;
			subFunctions = updatedItems;
			showSuccessToast('Updated Sub Core Function Position');
		} catch (error) {
			console.error('Failed to update positions:', error);
			showErrorToast('Failed to update order. Please try again.');
			dndItems = [...subFunctions];
		} finally {
			isUpdating = false;
		}
	}

	async function fetchSubCoreFunctions(): Promise<void> {
		try {
			isLoading = true;
			const response = await fetch(`/api/sub_core_function?core_function_id=${coreFunctionId}`);
			const result: SubCoreFunctionResponse = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to fetch sub core functions');
			}

			subFunctions = result.data;
			dndItems = result.data;
			$currentSubCoreFunctions = result.data;
		} catch (error) {
			console.error('Error fetching sub core functions:', error);
			showErrorToast('Failed to load sub core functions');
		} finally {
			isLoading = false;
		}
	}

	async function toggleExpand() {
		isExpanded = !isExpanded;
		if (isExpanded && subFunctions.length === 0) {
			await fetchSubCoreFunctions();
		}
	}
	$effect(() => {
		if (!isUpdating && !isLoading) {
			const newData = $currentSubCoreFunctions;
			subFunctions = newData;
			dndItems = newData;
		}
	});
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
		<div class="border-t p-4">
			{#if isLoading}
				<div class="flex justify-center py-4">
					<LoaderCircle class="h-6 w-6 animate-spin" />
				</div>
			{:else}
				<div
					class="relative"
					use:dndzone={{ items: dndItems, flipDurationMs }}
					onconsider={handleDndConsider}
					onfinalize={handleDndFinalize}
				>
					{#if isUpdating}
						<div class="absolute right-2 top-2">
							<LoaderCircle class="h-4 w-4 animate-spin" />
						</div>
					{/if}

					{#if dndItems.length === 0}
						<div class="text-center text-gray-500">No sub-core functions found</div>
					{:else}
						{#each dndItems as subCoreFunction (subCoreFunction.id)}
							<div class="py-2">
								<CoreFunctionIndicator
									name={subCoreFunction.name}
									sub_core_function_id={subCoreFunction.id}
								/>
							</div>
						{/each}
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>
