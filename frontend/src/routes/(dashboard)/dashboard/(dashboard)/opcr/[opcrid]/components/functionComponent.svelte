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
	import {
		fetchOpcrFunctionCategories,
		fetchOpcrIndicators,
		updateOpcrCategoryPosition,
		updateOpcrIndicatorPosition
	} from '../utils/page_helper';
	import CreateCategoryDialog from './sub_component/category/create.svelte';
	import Update from './sub_component/function/update.svelte';
	import CreateIndicatorDialog from './sub_component/indicator/create.svelte';
	import CategoryComponent from './categoryComponent.svelte';
	import IndicatorComponent from './indicatorComponent.svelte';
	import { getOpcrFunctionFormContext } from '../states/function_form_state';
	import { getOpcrFunctionStore } from '../states/function_state';
	import { setOpcrCategoryStore } from '../states/category_state';
	import { setOpcrIndicatorStore } from '../states/indicator_state';
	import type { OPCRFunctionFormResult } from '../utils/types';

	//props
	interface Iprops {
		opcrFunction: Tables<'opcr_function'>;
	}
	let { opcrFunction }: Iprops = $props();

	//stores
	const { deleteForm } = getOpcrFunctionFormContext();
	const { removeOpcrFunction } = getOpcrFunctionStore();
	const { currentOpcrCategories } = setOpcrCategoryStore();
	const { currentOpcrIndicators } = setOpcrIndicatorStore();

	//states
	type DndItem =
		| (Tables<'opcr_function_category'> & { itemType: 'category' })
		| (Tables<'opcr_indicator'> & { itemType: 'indicator' });

	let dndItems = $state<DndItem[]>([]);
	let isLoading = $state(false);
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let isAddDrawerOpen = $state(false);

	// // Separate fetch function
	async function fetchData() {
		isLoading = true;

		try {
			const [opcrFunctionResult, opcrIndicatorResult] = await Promise.all([
				fetchOpcrFunctionCategories(opcrFunction.id),
				fetchOpcrIndicators('opcr_function_id', opcrFunction.id)
			]);

			if (opcrFunctionResult.error || opcrIndicatorResult.error) {
				throw new Error(opcrFunctionResult.error || opcrIndicatorResult.error);
			}

			//add type discriminator
			const functionItems = opcrFunctionResult.data.map((item) => ({
				...item,
				itemType: 'category' as const
			}));

			const indicatorItems = opcrIndicatorResult.data.map((item) => ({
				...item,
				itemType: 'indicator' as const
			}));

			dndItems = [...functionItems, ...indicatorItems].sort((a, b) => a.position - b.position);

			$currentOpcrCategories = opcrFunctionResult.data;
			$currentOpcrIndicators = opcrIndicatorResult.data;
		} catch (error) {
			console.error('Error fetching data:', error);
			showErrorToast('Failed to load data');
		} finally {
			isLoading = false;
		}
	}

	async function handlePositionsUpdate(updatedItems: DndItem[]): Promise<void> {
		const opcrCategory = updatedItems.filter(
			(item): item is Tables<'opcr_function_category'> & { itemType: 'category' } =>
				item.itemType === 'category'
		);
		const opcrIndicators = updatedItems.filter(
			(item): item is Tables<'opcr_indicator'> & { itemType: 'indicator' } =>
				item.itemType === 'indicator'
		);
		await Promise.all([
			updateOpcrCategoryPosition(opcrCategory),
			updateOpcrIndicatorPosition(opcrIndicators)
		]);

		$currentOpcrCategories = opcrCategory;
		$currentOpcrIndicators = opcrIndicators;
	}

	//functions
	function handleDelete(result: { type: string; data: OPCRFunctionFormResult }) {
		if (result.data.opcrFunction) {
			const opcrFunction = result.data.opcrFunction;
			removeOpcrFunction(opcrFunction.id);
			showWarningToast(`Successfully deleted ${opcrFunction.title}`);
		}
	}

	$effect(() => {
		// Only run when these stores change
		const categories = $currentOpcrCategories;
		const indicators = $currentOpcrIndicators;

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
			<h2 class="text-md md:text-md text-base font-bold">{opcrFunction.title}</h2>
		</div>
		<div class="flex items-center gap-5">
			{#snippet createCategoryDialog()}
				<CreateCategoryDialog opcrFunctionId={opcrFunction.id} bind:isAddDrawerOpen />
			{/snippet}
			{#snippet createIndicatorDialog()}
				<CreateIndicatorDialog
					bind:isDrawerOpen
					opcrFunctionId={opcrFunction.id}
					bind:isAddDrawerOpen
				/>
			{/snippet}
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={opcrFunction.id}
					name={opcrFunction.title}
					action="?/deleteopcrfunction"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateAction()}
				<Update bind:isDrawerOpen {opcrFunction} />
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
						<CategoryComponent opcrCategory={item} />
					{:else}
						<IndicatorComponent opcrIndicator={item} />
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
