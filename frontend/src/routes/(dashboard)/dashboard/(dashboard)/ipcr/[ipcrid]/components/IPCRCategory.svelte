<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { Tables } from '$lib/types/database.types';
	import { cn } from '$lib/utils';
	import { slide } from 'svelte/transition';
	import { ChevronDown } from 'lucide-svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import { showErrorToast, showWarningToast } from '$lib/utils/toast';
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import { getIpcrFunctionCategoryStore } from '../states/ipcr_category_state';
	import { getIpcrFunctionCategoryFormContext } from '../states/ipcr_category_form_state';
	import UpdateDialog from './sub_components/ipcr_category/UpdateDialog.svelte';
	import { setIpcrIndicatorStore } from '../states/ipcr_indicator_state';
	import {
		fetchIpcrFunctionIndicators,
		fetchIpcrFunctionSubCategories,
		updateIndicatorPosition,
		updateSubCategoryPosition
	} from '../utils/page_loader_services';
	import { setIpcrFunctionSubCategoryStore } from '../states/ipcr_sub_category_state';
	import IpcrSubCategory from './IPCRSubCategory.svelte';
	import IpcrIndicator from './IPCRIndicator.svelte';
	import CreateDialog from './sub_components/ipcr_sub_category/CreateDialog.svelte';
	import CreateIndicatorDialog from './sub_components/ipcr_indicator/CreateDialog.svelte';
	import { getIpcrStore } from '../states/current_ipcr_state';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	//props
	interface Iprops {
		ipcrFunctionCategory: Tables<'ipcr_function_category'>;
	}
	let { ipcrFunctionCategory }: Iprops = $props();

	//stores
	const { removeIpcrFunctionCategory } = getIpcrFunctionCategoryStore();
	const { deleteForm } = getIpcrFunctionCategoryFormContext();
	const { currentIpcrFunctionSubCategories } = setIpcrFunctionSubCategoryStore();
	const { currentIpcrIndicators } = setIpcrIndicatorStore();
	const { canEdit } = getIpcrStore();

	//states
	type DndItem =
		| (Tables<'ipcr_function_sub_category'> & { itemType: 'sub_category' })
		| (Tables<'ipcr_indicator'> & { itemType: 'indicator' });
	let dndItems: DndItem[] = $state([]);
	let isLoading = $state(false);
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let isAddDrawerOpen = $state(false);

	// API BASED
	async function fetchData() {
		isLoading = true;

		try {
			const [ipcrSubCategoryResult, ipcrIndicatorResult] = await Promise.all([
				fetchIpcrFunctionSubCategories(ipcrFunctionCategory.id),
				fetchIpcrFunctionIndicators('ipcr_category_id', ipcrFunctionCategory.id)
			]);

			if (ipcrSubCategoryResult.error || ipcrIndicatorResult.error) {
				throw new Error('Failed to fetch data');
			}
			const subCategoryItems = ipcrSubCategoryResult.data.map((item) => ({
				...item,
				itemType: 'sub_category' as const
			}));
			const indicatorItems = ipcrIndicatorResult.data.map((item) => ({
				...item,
				itemType: 'indicator' as const
			}));
			dndItems = [...subCategoryItems, ...indicatorItems].sort((a, b) => a.position - b.position);
			$currentIpcrFunctionSubCategories = subCategoryItems;
			$currentIpcrIndicators = indicatorItems;
		} catch (error) {
			console.error('Error fetching data:', error);
			showErrorToast('Failed to load data');
		} finally {
			isLoading = false;
		}
	}

	async function handlePositionsUpdate(updatedItems: DndItem[]): Promise<void> {
		const ipcrSubCategory = updatedItems.filter(
			(item): item is Tables<'ipcr_function_sub_category'> & { itemType: 'sub_category' } =>
				item.itemType === 'sub_category'
		);
		const ipcrIndicators = updatedItems.filter(
			(item): item is Tables<'ipcr_indicator'> & { itemType: 'indicator' } =>
				item.itemType === 'indicator'
		);
		await Promise.all([
			updateSubCategoryPosition(ipcrSubCategory),
			updateIndicatorPosition(ipcrIndicators)
		]);

		$currentIpcrFunctionSubCategories = ipcrSubCategory;
		$currentIpcrIndicators = ipcrIndicators;
	}

	//REACTIVITY
	$effect(() => {
		// Only run when these stores change
		const subCategories = $currentIpcrFunctionSubCategories;
		const indicators = $currentIpcrIndicators;

		if (!isLoading) {
			const functionItems = subCategories.map((item) => ({
				...item,
				itemType: 'sub_category' as const
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

	// Clean toggle function
	async function toggleExpand() {
		isExpanded = !isExpanded;

		if (isExpanded && dndItems.length === 0) {
			await fetchData();
		}
	}

	//functions
	function handleDelete(result: { type: string; data: any }) {
		if (result.data.ipcrFunctionCategory) {
			const ipcrFunctionCategory = result.data.ipcrFunctionCategory;
			removeIpcrFunctionCategory(ipcrFunctionCategory.id);
			showWarningToast(`Successfully deleted ${ipcrFunctionCategory.objective}`);
		}
	}
</script>

<div class="rounded-lg border">
	<div class="flex h-10 items-center justify-between p-4">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" onclick={toggleExpand}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<div class="flex items-center gap-2">
				<Badge variant={'secondary'} class="h-5 text-xs">Category</Badge>
				<h1 class="text-sm">{ipcrFunctionCategory.category}</h1>
				<p class="text-xs text-gray-500">{ipcrFunctionCategory.unit ?? '_'} units</p>
			</div>
		</div>
		<div class="flex items-center gap-5">
			{#if $canEdit}
				{#snippet createDialog()}
					<CreateDialog
						bind:isDrawerOpen={isAddDrawerOpen}
						ipcrCategoryId={ipcrFunctionCategory.id}
					/>
				{/snippet}
				{#snippet createIndicatorDialog()}
					<CreateIndicatorDialog
						bind:isDrawerOpen={isAddDrawerOpen}
						ipcrFunctionCategoryId={ipcrFunctionCategory.id}
					/>
				{/snippet}
				{#snippet deleteAction()}
					<UniversalDeleteAction
						id={ipcrFunctionCategory.id}
						action="?/deleteipcrfunctioncategory"
						data={deleteForm}
						onDelete={handleDelete}
					/>
				{/snippet}
				{#snippet updateAction()}
					<UpdateDialog bind:isDrawerOpen {ipcrFunctionCategory} />
				{/snippet}
				<div class="flex gap-4">
					<DropDownWrapper
						icon={ChevronDown}
						text={'Add options'}
						childrens={[createDialog, createIndicatorDialog]}
						bind:isDrawerOpen={isAddDrawerOpen}
					/>
					<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
				</div>
			{/if}
		</div>
	</div>

	{#if isExpanded}
		<div class="p-4" transition:slide={{ duration: 300 }}>
			<div class="border-t p-4" transition:slide={{ duration: 300 }}>
				{#snippet dndItem(item: DndItem)}
					{#if item.itemType === 'sub_category'}
						<IpcrSubCategory ipcrSubCategory={item} />
					{:else}
						<IpcrIndicator ipcrFunctionIndicator={item} />
					{/if}
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
		</div>
	{/if}
</div>
