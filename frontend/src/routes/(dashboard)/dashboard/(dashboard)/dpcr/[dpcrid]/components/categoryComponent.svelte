<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { ChevronDown } from 'lucide-svelte';
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import type { Tables } from '$lib/types/database.types';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { setDpcrIndicatorStore } from '../states/indicator_state';
	import { getDpcrCategoryFormContext } from '../states/category_form_state';
	import { fetchDpcrIndicators, updateDpcrIndicatorPosition } from '../utils/page_helper';
	import { showErrorToast, showWarningToast } from '$lib/utils/toast';
	import type { DPCRCategoryFormResult } from '../utils/types';
	import { getDpcrCategoryStore } from '../states/category_state';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import Update from './sub_component/category/update.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import Create from './sub_component/indicator/create.svelte';
	import IndicatorComponent from './indicatorComponent.svelte';
	import TruncatedDiv from '../../../components/TruncatedDiv.svelte';

	interface Iprops {
		dpcrCategory: Tables<'dpcr_function_category'>;
	}

	let { dpcrCategory }: Iprops = $props();

	// States
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let isLoading = $state(false);
	let dndItems = $state<Tables<'dpcr_indicator'>[]>([]);

	// Store initialization
	const { currentDpcrIndicators } = setDpcrIndicatorStore();
	const { removeDpcrCategory } = getDpcrCategoryStore();
	const { deleteForm } = getDpcrCategoryFormContext();

	// API Functions
	const updateIndicatorPositions = async (items: Tables<'dpcr_indicator'>[]): Promise<void> => {
		const indicators = await updateDpcrIndicatorPosition(items);
		if (indicators.error) {
			showErrorToast('Failed to update indicator positions');
			return;
		}
		$currentDpcrIndicators = items;
	};

	async function fetchIndicators(): Promise<void> {
		try {
			isLoading = true;
			const result = await fetchDpcrIndicators('dpcr_function_category_id', dpcrCategory.id);

			if (result.error) {
				throw new Error(result.error);
			}

			dndItems = result.data;
			$currentDpcrIndicators = result.data;
		} catch (error) {
			console.error('Error fetching indicators:', error);
			showErrorToast('Failed to load indicators');
		} finally {
			isLoading = false;
		}
	}

	// UI Handlers
	async function toggleExpand() {
		isExpanded = !isExpanded;
		if (isExpanded && dndItems.length === 0) {
			await fetchIndicators();
		}
	}

	$effect(() => {
		if (!isLoading) {
			dndItems = [...$currentDpcrIndicators];
		}
	});

	function handleDelete(result: { type: string; data: DPCRCategoryFormResult }) {
		if (result.data.dpcrCategory) {
			const dpcrCategory = result.data.dpcrCategory;
			removeDpcrCategory(dpcrCategory.id);
			showWarningToast(`Successfully deleted DPCR category`);
		}
	}
</script>

<div class="rounded-lg border">
	<div class="flex h-auto items-center justify-between p-3">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" class="md:flex" onclick={toggleExpand}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<div class="flex h-auto items-center gap-2">
				<Badge variant={'secondary'} class="h-5 bg-green-400 text-xs">Sub-Category</Badge>
				<TruncatedDiv text={dpcrCategory.category} maxLength={50} />
			</div>
		</div>
		{#snippet deleteAction()}
			<UniversalDeleteAction
				id={dpcrCategory.id}
				action="?/deletecategory"
				data={deleteForm}
				onDelete={handleDelete}
			/>
		{/snippet}
		{#snippet updateDialog()}
			<Update {dpcrCategory} bind:isDrawerOpen />
		{/snippet}
		<div class="flex gap-4">
			<Create bind:isDrawerOpen dpcrCategoryId={dpcrCategory.id} />
			<DropDownWrapper childrens={[updateDialog, deleteAction]} bind:isDrawerOpen />
		</div>
	</div>

	{#if isExpanded}
		<div class="border-t p-3">
			<DndContainer
				bind:items={dndItems}
				{isLoading}
				onPositionsUpdate={updateIndicatorPositions}
				emptyMessage="No Indicators Found"
				successMessage="Successfully Updated Indicator Position"
				errorMessage="Failed to update indicator order. Please try again"
			>
				{#each dndItems as indicator (indicator.id)}
					<IndicatorComponent dpcrIndicator={indicator} />
				{/each}
			</DndContainer>
		</div>
	{/if}
</div>
