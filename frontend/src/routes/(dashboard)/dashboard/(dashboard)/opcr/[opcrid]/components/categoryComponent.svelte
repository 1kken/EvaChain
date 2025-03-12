<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { ChevronDown } from 'lucide-svelte';
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import type { Tables } from '$lib/types/database.types';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { showErrorToast, showWarningToast } from '$lib/utils/toast';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import Update from './sub_component/category/update.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import Create from './sub_component/indicator/create.svelte';
	import IndicatorComponent from './indicatorComponent.svelte';
	import TruncatedDiv from '../../../components/TruncatedDiv.svelte';
	import { slide } from 'svelte/transition';
	import { setOpcrIndicatorStore } from '../states/indicator_state';
	import { getOpcrCategoryStore } from '../states/category_state';
	import { getOpcrCategoryFormContext } from '../states/category_form_state';
	import { fetchOpcrIndicators, updateOpcrIndicatorPosition } from '../utils/page_helper';
	import type { OPCRCategoryFormResult } from '../utils/types';

	interface Iprops {
		opcrCategory: Tables<'opcr_function_category'>;
	}

	let { opcrCategory }: Iprops = $props();

	// States
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let isLoading = $state(false);
	let dndItems = $state<Tables<'opcr_indicator'>[]>([]);

	// Store initialization
	const { currentOpcrIndicators } = setOpcrIndicatorStore();
	const { removeOpcrCategory } = getOpcrCategoryStore();
	const { deleteForm } = getOpcrCategoryFormContext();

	// API Functions
	const updateIndicatorPositions = async (items: Tables<'opcr_indicator'>[]): Promise<void> => {
		const indicators = await updateOpcrIndicatorPosition(items);
		if (indicators.error) {
			showErrorToast('Failed to update indicator positions');
			return;
		}
		$currentOpcrIndicators = items;
	};

	async function fetchIndicators(): Promise<void> {
		try {
			isLoading = true;
			const result = await fetchOpcrIndicators('opcr_function_category_id', opcrCategory.id);

			if (result.error) {
				throw new Error(result.error);
			}

			dndItems = result.data;
			$currentOpcrIndicators = result.data;
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
			dndItems = [...$currentOpcrIndicators];
		}
	});

	function handleDelete(result: { type: string; data: OPCRCategoryFormResult }) {
		if (result.data.opcrCategory) {
			const opcrCategory = result.data.opcrCategory;
			removeOpcrCategory(opcrCategory.id);
			showWarningToast(`Successfully deleted OPCR category`);
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
				<Badge variant={'secondary'} class="h-5 bg-green-400 text-xs">Strategy Plan</Badge>
				<TruncatedDiv text={opcrCategory.category} maxLength={50} />
			</div>
		</div>
		{#snippet deleteAction()}
			<UniversalDeleteAction
				id={opcrCategory.id}
				action="?/deleteopcrcategory"
				data={deleteForm}
				onDelete={handleDelete}
			/>
		{/snippet}
		{#snippet updateDialog()}
			<Update {opcrCategory} bind:isDrawerOpen />
		{/snippet}
		<div class="flex gap-4">
			<Create bind:isDrawerOpen opcrCategoryId={opcrCategory.id} />
			<DropDownWrapper childrens={[updateDialog, deleteAction]} bind:isDrawerOpen />
		</div>
	</div>

	{#if isExpanded}
		<div class="border-t p-3" transition:slide={{ duration: 300 }}>
			<DndContainer
				bind:items={dndItems}
				{isLoading}
				onPositionsUpdate={updateIndicatorPositions}
				emptyMessage="No Indicators Found"
				successMessage="Successfully Updated Indicator Position"
				errorMessage="Failed to update indicator order. Please try again"
			>
				{#each dndItems as indicator (indicator.id)}
					<IndicatorComponent opcrIndicator={indicator} />
				{/each}
			</DndContainer>
		</div>
	{/if}
</div>
