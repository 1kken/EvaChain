<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronDown } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import type { Tables } from '$lib/types/database.types';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import { showWarningToast, showErrorToast } from '$lib/utils/toast';
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import { slide } from 'svelte/transition';
	import { getDpcrFunctionFormContext } from '../states/function_form_state';
	import { getDpcrFunctionStore } from '../states/function_state';
	import Update from './sub_component/function/update.svelte';
	import type { DPCRFunctionFormResult } from '../utils/types';
	import { setDpcrCategoryStore } from '../states/category_state';
	import { setDpcrIndicatorStore } from '../states/indicator_state';
	import {
		fetchDpcrFunctionCategories,
		fetchDpcrIndicators,
		updateDpcrCategoryPosition,
		updateDpcrIndicatorPosition
	} from '../utils/page_helper';
	import CreateCategoryDialog from './sub_component/category/create.svelte';
	import CreateIndicatorDialog from './sub_component/indicator/create.svelte';
	import CategoryComponent from './categoryComponent.svelte';
	import IndicatorComponent from './indicatorComponent.svelte';

	//props
	interface Iprops {
		dpcrFunction: Tables<'dpcr_function'>;
	}
	let { dpcrFunction }: Iprops = $props();

	//stores
	const { deleteForm } = getDpcrFunctionFormContext();
	const { removeDpcrFunction } = getDpcrFunctionStore();
	const { currentDpcrCategories } = setDpcrCategoryStore();
	const { currentDpcrIndicators } = setDpcrIndicatorStore();

	//states
	type DndItem =
		| (Tables<'dpcr_function_category'> & { itemType: 'category' })
		| (Tables<'dpcr_indicator'> & { itemType: 'indicator' });

	let dndItems = $state<DndItem[]>([]);
	let isLoading = $state(false);
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let isAddDrawerOpen = $state(false);

	// // Separate fetch function
	async function fetchData() {
		isLoading = true;

		try {
			const [dpcrFunctionResult, dpcrIndicatorResult] = await Promise.all([
				fetchDpcrFunctionCategories(dpcrFunction.id),
				fetchDpcrIndicators('dpcr_function_id', dpcrFunction.id)
			]);

			if (dpcrFunctionResult.error || dpcrIndicatorResult.error) {
				throw new Error(dpcrFunctionResult.error || dpcrIndicatorResult.error);
			}

			//add type discriminator
			const functionItems = dpcrFunctionResult.data.map((item) => ({
				...item,
				itemType: 'category' as const
			}));

			const indicatorItems = dpcrIndicatorResult.data.map((item) => ({
				...item,
				itemType: 'indicator' as const
			}));

			dndItems = [...functionItems, ...indicatorItems].sort((a, b) => a.position - b.position);

			$currentDpcrCategories = dpcrFunctionResult.data;
			$currentDpcrIndicators = dpcrIndicatorResult.data;
		} catch (error) {
			console.error('Error fetching data:', error);
			showErrorToast('Failed to load data');
		} finally {
			isLoading = false;
		}
	}

	async function handlePositionsUpdate(updatedItems: DndItem[]): Promise<void> {
		const dpcrCategory = updatedItems.filter(
			(item): item is Tables<'dpcr_function_category'> & { itemType: 'category' } =>
				item.itemType === 'category'
		);
		const dpcrIndicators = updatedItems.filter(
			(item): item is Tables<'dpcr_indicator'> & { itemType: 'indicator' } =>
				item.itemType === 'indicator'
		);
		await Promise.all([
			updateDpcrCategoryPosition(dpcrCategory),
			updateDpcrIndicatorPosition(dpcrIndicators)
		]);

		$currentDpcrCategories = dpcrCategory;
		$currentDpcrIndicators = dpcrIndicators;
	}

	//functions
	function handleDelete(result: { type: string; data: DPCRFunctionFormResult }) {
		if (result.data.dpcrFunction) {
			const dpcrFunction = result.data.dpcrFunction;
			removeDpcrFunction(dpcrFunction.id);
			showWarningToast(`Successfully deleted ${dpcrFunction.title}`);
		}
	}

	$effect(() => {
		// Only run when these stores change
		const categories = $currentDpcrCategories;
		const indicators = $currentDpcrIndicators;

		if (!isLoading) {
			const functionItems = categories.map((item) => ({
				...item,
				itemType: 'category' as const
			}));

			const indicatorItems = indicators.map((item) => ({
				...item,
				itemType: 'indicator' as const
			}));

			const newItems = [...functionItems, ...indicatorItems].sort(
				(a, b) => a.position - b.position
			);

			// Only update if the items have actually changed
			dndItems = newItems;
		}
	});

	// Simplified toggle function
	async function toggleExpand() {
		isExpanded = !isExpanded;

		if (isExpanded && dndItems.length === 0) {
			await fetchData();
		}
	}
</script>

<div class="w-full">
	<header class="sticky top-0 flex h-10 items-center justify-between border-b px-4 md:px-10">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" onclick={toggleExpand}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<h2 class="text-md md:text-md text-base font-bold">{dpcrFunction.title}</h2>
		</div>
		<div class="flex items-center gap-5">
			{#snippet createCategoryDialog()}
				<CreateCategoryDialog dpcrFunctionId={dpcrFunction.id} bind:isDrawerOpen />
			{/snippet}
			{#snippet createIndicatorDialog()}
				<CreateIndicatorDialog bind:isDrawerOpen dpcrFunctionId={dpcrFunction.id} />
			{/snippet}
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={dpcrFunction.id}
					name={dpcrFunction.title}
					action="?/deletedpcrfunction"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateAction()}
				<Update bind:isDrawerOpen {dpcrFunction} />
			{/snippet}
			<div class="flex gap-4">
				<DropDownWrapper
					icon={ChevronDown}
					text={'Add options'}
					childrens={[createCategoryDialog, createIndicatorDialog]}
					bind:isDrawerOpen={isAddDrawerOpen}
				/>
				<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
			</div>
		</div>
	</header>

	{#if isExpanded}
		<div class="p-4" transition:slide={{ duration: 300 }}>
			{#snippet dndItem(item: DndItem)}
				<div class="py-2">
					{#if item.itemType === 'category'}
						<CategoryComponent dpcrCategory={item} />
					{:else}
						<IndicatorComponent dpcrIndicator={item} />
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
