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
	import { getIpcrFunctionFormContext } from '../states/ipcr_function_form_state';
	import { getIpcrFunctionStore } from '../states/ipcr_function_state';
	import type { IPCRFunctionFormResult } from '../utils/types';
	import UpdateDialog from './sub_components/ipcr_function/UpdateDialog.svelte';
	import {
		fetchIpcrFunctionCategories,
		fetchIpcrFunctionIndicators,
		updateCategoryPosition,
		updateIndicatorPosition
	} from '../utils/page_loader_services';
	import { setIpcrFunctionCategoryStore } from '../states/ipcr_category_state';
	import IpcrCategory from './IPCRCategory.svelte';
	import CreateDialog from './sub_components/ipcr_category/CreateDialog.svelte';
	import CreateIndicatorDialog from './sub_components/ipcr_indicator/CreateDialog.svelte';
	import { setIpcrIndicatorStore } from '../states/ipcr_indicator_state';
	import IpcrIndicator from './IPCRIndicator.svelte';
	import { getIpcrStore } from '../states/current_ipcr_state';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	//props
	interface Iprops {
		ipcrFunction: Tables<'ipcr_function'>;
	}
	let { ipcrFunction }: Iprops = $props();

	//stores
	const { deleteForm } = getIpcrFunctionFormContext();
	const { removeIpcrFunction } = getIpcrFunctionStore();
	const { currentIpcrFunctionCategories } = setIpcrFunctionCategoryStore();
	const { currentIpcrIndicators } = setIpcrIndicatorStore();
	const { canEdit } = getIpcrStore();

	//states
	type DndItem =
		| (Tables<'ipcr_function_category'> & { itemType: 'category' })
		| (Tables<'ipcr_indicator'> & { itemType: 'indicator' });

	let dndItems = $state<DndItem[]>([]);
	let isLoading = $state(false);
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let isAddDrawerOpen = $state(false);

	// // Separate fetch function
	async function fetchData() {
		isLoading = true;

		try {
			const [ipcrFunctionResult, ipcrIndicatorResult] = await Promise.all([
				fetchIpcrFunctionCategories(ipcrFunction.id),
				fetchIpcrFunctionIndicators('ipcr_function_id', ipcrFunction.id)
			]);

			if (ipcrFunctionResult.error || ipcrIndicatorResult.error) {
				throw new Error(ipcrFunctionResult.error || ipcrIndicatorResult.error);
			}

			//add type discriminator
			const functionItems = ipcrFunctionResult.data.map((item) => ({
				...item,
				itemType: 'category' as const
			}));

			const indicatorItems = ipcrIndicatorResult.data.map((item) => ({
				...item,
				itemType: 'indicator' as const
			}));

			dndItems = [...functionItems, ...indicatorItems].sort((a, b) => a.position - b.position);

			$currentIpcrFunctionCategories = ipcrFunctionResult.data;
			$currentIpcrIndicators = ipcrIndicatorResult.data;
		} catch (error) {
			console.error('Error fetching data:', error);
			showErrorToast('Failed to load data');
		} finally {
			isLoading = false;
		}
	}

	async function handlePositionsUpdate(updatedItems: DndItem[]): Promise<void> {
		const ipcrCategory = updatedItems.filter(
			(item): item is Tables<'ipcr_function_category'> & { itemType: 'category' } =>
				item.itemType === 'category'
		);
		const ipcrIndicators = updatedItems.filter(
			(item): item is Tables<'ipcr_indicator'> & { itemType: 'indicator' } =>
				item.itemType === 'indicator'
		);
		await Promise.all([
			updateCategoryPosition(ipcrCategory),
			updateIndicatorPosition(ipcrIndicators)
		]);

		$currentIpcrFunctionCategories = ipcrCategory;
		$currentIpcrIndicators = ipcrIndicators;
	}

	//functions
	function handleDelete(result: { type: string; data: IPCRFunctionFormResult }) {
		if (result.data.ipcrFunction) {
			const ipcrFunction = result.data.ipcrFunction;
			removeIpcrFunction(ipcrFunction.id);
			showWarningToast(`Successfully deleted ${ipcrFunction.title}`);
		}
	}

	$effect(() => {
		// Only run when these stores change
		const categories = $currentIpcrFunctionCategories;
		const indicators = $currentIpcrIndicators;

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
			<h2 class="text-md md:text-md text-base font-bold">{ipcrFunction.title}</h2>
		</div>
		<div class="flex items-center gap-5">
			{#if $canEdit}
				{#snippet createDialog()}
					<CreateDialog bind:isDrawerOpen={isAddDrawerOpen} ipcrFunctionId={ipcrFunction.id} />
				{/snippet}
				{#snippet createIndicatorDialog()}
					<CreateIndicatorDialog
						bind:isDrawerOpen={isAddDrawerOpen}
						ipcrFunctionId={ipcrFunction.id}
					/>
				{/snippet}
				{#snippet deleteAction()}
					<UniversalDeleteAction
						id={ipcrFunction.id}
						name={ipcrFunction.title}
						action="?/deleteipcrfunction"
						data={deleteForm}
						onDelete={handleDelete}
					/>
				{/snippet}
				{#snippet updateAction()}
					<UpdateDialog bind:isDrawerOpen {ipcrFunction} />
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
	</header>

	{#if isExpanded}
		<div class="p-4" transition:slide={{ duration: 300 }}>
			{#snippet dndItem(item: DndItem)}
				<div class="py-2">
					{#if item.itemType === 'category'}
						<IpcrCategory ipcrFunctionCategory={item} />
					{:else}
						<IpcrIndicator ipcrFunctionIndicator={item} />
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
