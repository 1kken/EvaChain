<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { ChevronDown, Plus, LoaderCircle } from 'lucide-svelte';
	import { dndzone } from 'svelte-dnd-action';
	import type { DndEvent } from 'svelte-dnd-action';
	import debounce from 'debounce';
	import SubCoreFunctionCreateDialog from './(subcomponents)/(create_dialogs)/SubCoreFunctionCreateDialog.svelte';
	import Indicator from './Indicator.svelte';
	import DeleteActionCoreFunction from './(subcomponents)/(delete_actions)/DeleteActionCoreFunction.svelte';
	import DropDownWrapper from '../DropDownWrapper.svelte';
	import CoreFunctionUpdateDialog from './(subcomponents)/(update_dialogs)/CoreFunctionUpdateDialog.svelte';
	import { setSubCoreFunctionStore } from '../../(data)/(state)/subcorefunctionstate.svelte';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import type { Tables } from '$lib/types/database.types';
	import CreateIndicatorDialog from '../../(indicator)/CreateIndicatorDialog.svelte';
	import { setIndicatorStore } from '../../(data)/indicator_state.svelte';
	import IndicatorComponent from '../../(indicator)/IndicatorComponent.svelte';
	import { fetchIndicatorsByParam, fetchSubCoreFunctions } from '../../../utils/fetching-utils';
	import {
		updateIndicatorPositions,
		updateSubCoreFunctionPositions
	} from '../../../utils/position-update';

	let {
		name,
		units,
		coreFunctionId
	}: { name: string; units?: number | null; coreFunctionId: string } = $props();
	// Types
	type DndItem =
		| (Tables<'sub_core_function'> & { itemType: 'sub_function' })
		| (Tables<'indicator'> & { itemType: 'indicator' });

	// State variables
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let isAddDrawerOpen = $state(false);
	let isLoading = $state(false);
	let isUpdating = $state(false);
	let dndItems = $state<DndItem[]>([]);
	const flipDurationMs = 300;

	// Initialize stores
	const store = setSubCoreFunctionStore();
	const { currentSubCoreFunctions } = store;
	const { currentIndicators } = setIndicatorStore();

	// Combined fetch function
	async function fetchData(): Promise<void> {
		try {
			isLoading = true;
			const [subFunctionsResult, indicatorsResult] = await Promise.all([
				fetchSubCoreFunctions(coreFunctionId),
				fetchIndicatorsByParam({
					url_params: 'core_function_id',
					id: coreFunctionId
				})
			]);

			// Handle any fetch errors
			if (subFunctionsResult.error || indicatorsResult.error) {
				throw new Error(subFunctionsResult.error || indicatorsResult.error);
			}

			// Add type discriminator
			const subFunctionItems = subFunctionsResult.data.map((item) => ({
				...item,
				itemType: 'sub_function' as const
			}));

			const indicatorItems = indicatorsResult.data.map((item) => ({
				...item,
				itemType: 'indicator' as const
			}));

			// Combine and sort by position
			dndItems = [...subFunctionItems, ...indicatorItems].sort((a, b) => a.position - b.position);

			// Update stores
			$currentSubCoreFunctions = subFunctionsResult.data;
			$currentIndicators = indicatorsResult.data;
		} catch (error) {
			console.error('Error fetching data:', error);
			showErrorToast('Failed to load data');
		} finally {
			isLoading = false;
		}
	}

	// Update toggle function
	async function toggleExpand() {
		isExpanded = !isExpanded;
		if (isExpanded && dndItems.length === 0) {
			await fetchData();
		}
	}

	// DND handlers
	function handleDndConsider(e: CustomEvent<DndEvent<DndItem>>) {
		const updatedItems = e.detail.items.map((item, index) => ({
			...item,
			position: (index + 1) * 100
		}));
		dndItems = updatedItems;
	}

	async function handleDndFinalize(e: CustomEvent<DndEvent<DndItem>>) {
		try {
			isUpdating = true;
			const updatedItems = e.detail.items.map((item, index) => ({
				...item,
				position: (index + 1) * 100
			}));

			// Split items by type
			const subFunctions = updatedItems.filter(
				(item): item is Tables<'sub_core_function'> & { itemType: 'sub_function' } =>
					item.itemType === 'sub_function'
			);

			const indicators = updatedItems.filter(
				(item): item is Tables<'indicator'> & { itemType: 'indicator' } =>
					item.itemType === 'indicator'
			);

			// Update both types
			await Promise.all([
				updateSubCoreFunctionPositions(subFunctions),
				updateIndicatorPositions(indicators)
			]);

			dndItems = updatedItems;
			$currentSubCoreFunctions = subFunctions;
			$currentIndicators = indicators;

			showSuccessToast('Updated positions successfully');
		} catch (error) {
			console.error('Failed to update positions:', error);
			showErrorToast('Failed to update order. Please try again.');
		} finally {
			isUpdating = false;
		}
	}

	$effect(() => {
		if (!isUpdating && !isLoading) {
			const subFunctionItems = $currentSubCoreFunctions.map((item) => ({
				...item,
				itemType: 'sub_function' as const
			}));

			const indicatorItems = $currentIndicators.map((item) => ({
				...item,
				itemType: 'indicator' as const
			}));

			dndItems = [...subFunctionItems, ...indicatorItems].sort((a, b) => a.position - b.position);
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
		{#snippet createSubCoreFunction()}
			<SubCoreFunctionCreateDialog {coreFunctionId} bind:isDrawerOpen={isAddDrawerOpen} />
		{/snippet}
		{#snippet createIndicatorDialog()}
			<CreateIndicatorDialog
				isDirectChild={true}
				config={{ type: 'core_function', id: coreFunctionId }}
				bind:isDrawerOpen={isAddDrawerOpen}
			/>
		{/snippet}
		<div class="flex gap-4">
			<DropDownWrapper
				icon={ChevronDown}
				text={'Add selections'}
				childrens={[createSubCoreFunction, createIndicatorDialog]}
				bind:isDrawerOpen={isAddDrawerOpen}
			/>
			<DropDownWrapper childrens={[updateDialog, deleteAction]} bind:isDrawerOpen />
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
					use:dndzone={{
						items: dndItems,
						flipDurationMs,
						dropFromOthersDisabled: true,
						dropTargetStyle: { outline: `rgba(102, 204, 255, 0.7) solid 2px` }
					}}
					onconsider={handleDndConsider}
					onfinalize={handleDndFinalize}
				>
					{#if isUpdating}
						<div class="absolute right-2 top-2">
							<LoaderCircle class="h-4 w-4 animate-spin" />
						</div>
					{/if}

					{#if dndItems.length === 0}
						<div class="text-center text-gray-500">No items found</div>
					{:else}
						{#each dndItems as item (item.id)}
							<div class="py-2">
								{#if item.itemType === 'sub_function'}
									<Indicator name={item.name} sub_core_function_id={item.id} />
								{:else}
									<IndicatorComponent indicator={item} />
								{/if}
							</div>
						{/each}
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>
