<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { ChevronDown, Plus, LoaderCircle } from 'lucide-svelte';
	import type { Tables } from '$lib/types/database.types';
	// import SubSupportFunctionCreateDialog from './(subcomponents)/(create_dialogs)/SubSupportCreateDialog.svelte';
	// import DeleteActionSupportFunction from './(subcomponents)/(delete_actions)/SupportDeleteAction.svelte';
	import DropDownWrapper from '../../(wrappers)/DropDownWrapper.svelte';
	import { setIndicatorStore } from '../../(data)/(state)/indicator_state.svelte';
	import { fetchIndicatorsByParam, fetchSubOtherFunctions } from '../../../utils/fetching_utils';
	import {
		updateIndicatorPositions,
		updateSubOtherFunctionPositions
	} from '../../../utils/position_update';
	import { getSingleIPCRStore } from '../../(data)/(state)/ipcr-state.svelte';
	import CreateIndicatorDialog from '../../(indicator)/CreateIndicatorDialog.svelte';
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import { showErrorToast } from '$lib/utils/toast';
	// import SupportFunctionUpdateDialog from './(subcomponents)/(update_dialogs)/SupportFunctionUpdateDialog.svelte';
	import IndicatorComponent from '../../(indicator)/IndicatorComponent.svelte';
	import { setSubOtherFunctionStore } from '../../(data)/(state)/sub_other_function_state.svelte';
	import OtherFunctionDeleteAction from './(subcomponents)/(delete_actions)/OtherFunctionDeleteAction.svelte';
	import OtherFunctionUpdateDialog from './(subcomponents)/(update_dialogs)/OtherFunctionUpdateDialog.svelte';
	import SubOtherFunctionCreateDialog from './(subcomponents)/(create_dialogs)/SubOtherFunctionCreateDialog.svelte';
	import Indicator from './Indicator.svelte';
	// import Indicator from './Indicator.svelte';

	let { otherFunction }: { otherFunction: Tables<'other_function'> } = $props();

	// Types
	type DndItem =
		| (Tables<'sub_other_function'> & { itemType: 'sub_function' })
		| (Tables<'indicator'> & { itemType: 'indicator' });

	// State variables
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let isAddDrawerOpen = $state(false);
	let isLoading = $state(false);
	let dndItems = $state<DndItem[]>([]);

	// Initialize stores
	// const { currentSubSupportFunctions } = store;
	const { currentSubOtherFunctions } = setSubOtherFunctionStore();
	const { currentIndicators } = setIndicatorStore();

	//get Stores
	const { canEdit } = getSingleIPCRStore();

	// Combined fetch function
	async function fetchData(): Promise<void> {
		try {
			isLoading = true;
			const [subFunctionsResult, indicatorsResult] = await Promise.all([
				fetchSubOtherFunctions(otherFunction.id),
				fetchIndicatorsByParam({
					url_params: 'other_function_id',
					id: otherFunction.id
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
			$currentSubOtherFunctions = subFunctionsResult.data;
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

	// Position update handler
	async function handlePositionsUpdate(updatedItems: DndItem[]): Promise<void> {
		const subFunctions = updatedItems.filter(
			(item): item is Tables<'sub_other_function'> & { itemType: 'sub_function' } =>
				item.itemType === 'sub_function'
		);

		const indicators = updatedItems.filter(
			(item): item is Tables<'indicator'> & { itemType: 'indicator' } =>
				item.itemType === 'indicator'
		);

		await Promise.all([
			updateSubOtherFunctionPositions(subFunctions),
			updateIndicatorPositions(indicators)
		]);

		$currentSubOtherFunctions = subFunctions;
		$currentIndicators = indicators;
	}

	$effect(() => {
		if (!isLoading) {
			const subFunctionItems = $currentSubOtherFunctions.map((item) => ({
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
				<h3 class="text-sm font-semibold md:text-base">{otherFunction.name}</h3>
				<p class="text-muted-foreground text-xs md:text-sm">
					({!otherFunction.unit ? ' _' : otherFunction.unit} units)
				</p>
			</div>
		</div>
		<div class="flex gap-4">
			{#if $canEdit}
				{#snippet deleteAction()}
					<OtherFunctionDeleteAction otherFunctionId={otherFunction.id} bind:isDrawerOpen />
				{/snippet}
				{#snippet updateDialog()}
					<OtherFunctionUpdateDialog otherFunctionId={otherFunction.id} bind:isDrawerOpen />
				{/snippet}
				{#snippet createSubSupportFunction()}
					<SubOtherFunctionCreateDialog
						otherFunctionId={otherFunction.id}
						bind:isDrawerOpen={isAddDrawerOpen}
					/>
				{/snippet}
				{#snippet createIndicatorDialog()}
					<CreateIndicatorDialog
						isDirectChild={true}
						config={{ type: 'other_function', id: otherFunction.id }}
						bind:isDrawerOpen={isAddDrawerOpen}
					/>
				{/snippet}
				<DropDownWrapper
					icon={ChevronDown}
					text={'Add selections'}
					childrens={[createSubSupportFunction, createIndicatorDialog]}
					bind:isDrawerOpen={isAddDrawerOpen}
				/>
				<DropDownWrapper childrens={[updateDialog, deleteAction]} bind:isDrawerOpen />
			{/if}
		</div>
	</div>

	{#if isExpanded}
		<div class="border-t p-4">
			{#snippet dndItem(item: DndItem)}
				<div class="py-2">
					{#if item.itemType === 'sub_function'}
						<Indicator name={item.name} sub_other_function_id={item.id} />
					{:else}
						<IndicatorComponent indicator={item} />
					{/if}
				</div>
			{/snippet}

			<DndContainer
				bind:items={dndItems}
				{isLoading}
				onPositionsUpdate={handlePositionsUpdate}
				emptyMessage="No items found"
				successMessage="Updated positions successfully"
				errorMessage="Failed to update order. Please try again."
			>
				{#each dndItems as item (item.id)}
					{@render dndItem(item)}
				{/each}
			</DndContainer>
		</div>
	{/if}
</div>
