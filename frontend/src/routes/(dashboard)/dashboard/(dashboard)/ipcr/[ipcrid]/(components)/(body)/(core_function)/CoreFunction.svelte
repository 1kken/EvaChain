<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronDown, LoaderCircle } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import debounce from 'debounce';
	import { dndzone } from 'svelte-dnd-action';
	import type { DndEvent } from 'svelte-dnd-action';
	import type { Tables } from '$lib/types/database.types';
	import CoreFunctionCreateDialog from './(subcomponents)/(create_dialogs)/CoreFunctionCreateDialog.svelte';
	import SubCoreFunction from './SubCoreFunction.svelte';
	import { getCoreFunctionStore } from '../../(data)/(state)/corefunctionstate.svelte';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';

	type CoreFunction = Tables<'core_function'>;

	const { currentCoreFunctions, currentIPCRid: currentIPCRidStore } = getCoreFunctionStore();
	let isExpanded = $state(false);
	let isUpdating = $state(false);
	let flipDurationMs = 300;
	let dndItems = $state<CoreFunction[]>([]);

	let { currentIpcrId }: { currentIpcrId: string } = $props();
	$currentIPCRidStore = currentIpcrId;

	// Sync dndItems with store
	$effect(() => {
		dndItems = [...$currentCoreFunctions];
	});

	const updateCoreFunctionPositions = debounce(async (items: CoreFunction[]) => {
		try {
			const response = await fetch('/api/core_function', {
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

	function handleDndConsider(e: CustomEvent<DndEvent<CoreFunction>>) {
		const updatedItems = e.detail.items.map((item, index) => ({
			...item,
			position: (index + 1) * 100
		}));
		dndItems = updatedItems;
	}

	async function handleDndFinalize(e: CustomEvent<DndEvent<CoreFunction>>) {
		try {
			isUpdating = true;
			const updatedItems = e.detail.items.map((item, index) => ({
				...item,
				position: (index + 1) * 100
			}));

			await updateCoreFunctionPositions(updatedItems);
			$currentCoreFunctions = updatedItems;
			showSuccessToast('Updated Core Function Position');
		} catch (error) {
			console.error('Failed to update positions:', error);
			showErrorToast('Failed to update order. Please try again.');
			dndItems = [...$currentCoreFunctions];
		} finally {
			isUpdating = false;
		}
	}

	function toggleExpand() {
		isExpanded = !isExpanded;
	}
</script>

<div class="w-full">
	<header class="sticky top-0 flex h-16 items-center justify-between border-b px-4 md:px-10">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" onclick={toggleExpand}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<h2 class="text-base font-bold md:text-xl">CORE FUNCTIONS</h2>
		</div>
		<CoreFunctionCreateDialog ipcrId={currentIpcrId} />
	</header>
</div>

{#if isExpanded}
	<div
		class="relative space-y-4 px-4 pt-4 md:pl-14 md:pr-10"
		use:dndzone={{ items: dndItems, flipDurationMs, dropFromOthersDisabled: true }}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
	>
		{#if isUpdating}
			<div class="absolute right-2 top-2">
				<LoaderCircle class="h-4 w-4 animate-spin" />
			</div>
		{/if}

		{#if dndItems.length === 0}
			<h1>No Core functions found</h1>
		{:else}
			{#each dndItems as coreFunction (coreFunction.id)}
				<SubCoreFunction
					name={coreFunction.name}
					units={coreFunction.unit}
					coreFunctionId={coreFunction.id}
				/>
			{/each}
		{/if}
	</div>
{/if}
