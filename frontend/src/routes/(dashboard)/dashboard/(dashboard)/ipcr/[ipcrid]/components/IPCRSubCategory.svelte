<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { ChevronDown } from 'lucide-svelte';
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { getIpcrIndicatorStore, setIpcrIndicatorStore } from '../states/ipcr_indicator_state';
	import {
		fetchIpcrFunctionIndicators,
		updateIndicatorPosition
	} from '../utils/page_loader_services';
	import { showErrorToast, showWarningToast } from '$lib/utils/toast';
	import IpcrIndicator from './IPCRIndicator.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import { getIpcrFunctionSubCategoryStore } from '../states/ipcr_sub_category_state';
	import { getIpcrFunctionSubCategoryFormContext } from '../states/ipcr_sub_category_form_state';
	import type { IPCRFunctionSubCategoryFormResult } from '../utils/types';
	import UpdateDialog from './sub_components/ipcr_sub_category/UpdateDialog.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import CreateIndicatorDialog from './sub_components/ipcr_indicator/CreateDialog.svelte';
	import { getIpcrStore } from '../states/current_ipcr_state';

	interface Iprops {
		ipcrSubCategory: Tables<'ipcr_function_sub_category'>;
	}

	let { ipcrSubCategory }: Iprops = $props();

	// States
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let isLoading = $state(false);
	let dndItems = $state<Tables<'ipcr_indicator'>[]>([]);

	// Store initialization
	// const { canEdit } = getSingleIPCRStore();
	const { currentIpcrIndicators } = setIpcrIndicatorStore();
	const { removeIpcrFunctionSubCategory } = getIpcrFunctionSubCategoryStore();
	const { deleteForm } = getIpcrFunctionSubCategoryFormContext();
	const { canEdit } = getIpcrStore();

	// API Functions
	const updateIndicatorPositions = async (items: Tables<'ipcr_indicator'>[]): Promise<void> => {
		const indicators = await updateIndicatorPosition(items);
		if (indicators.error) {
			showErrorToast('Failed to update indicator positions');
			return;
		}
		$currentIpcrIndicators = indicators.data;
	};

	async function fetchIndicators(): Promise<void> {
		try {
			isLoading = true;
			const result = await fetchIpcrFunctionIndicators('ipcr_sub_category_id', ipcrSubCategory.id);

			if (result.error) {
				throw new Error(result.error);
			}

			dndItems = result.data;
			$currentIpcrIndicators = result.data;
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
			dndItems = [...$currentIpcrIndicators];
		}
	});

	function handleDelete(result: { type: string; data: IPCRFunctionSubCategoryFormResult }) {
		if (result.data.ipcrFunctionSubCategory) {
			const ipcrFunctionIndicator = result.data.ipcrFunctionSubCategory;
			removeIpcrFunctionSubCategory(ipcrFunctionIndicator.id);
			showWarningToast(`Successfully deleted sub category`);
		}
	}
</script>

<div class="rounded-lg border">
	<div class="flex min-h-[3.5rem] items-center justify-between p-3">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" class="md:flex" onclick={toggleExpand}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<h1 class="text-sm">{ipcrSubCategory.sub_category}</h1>
		</div>
		{#if $canEdit}
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={ipcrSubCategory.id}
					action="?/deleteipcrfunctionsubcategory"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateDialog()}
				<UpdateDialog {ipcrSubCategory} bind:isDrawerOpen />
			{/snippet}
			<div class="flex gap-4">
				<CreateIndicatorDialog bind:isDrawerOpen ipcrFunctionSubCategoryId={ipcrSubCategory.id} />
				<DropDownWrapper childrens={[updateDialog, deleteAction]} bind:isDrawerOpen />
			</div>
		{/if}
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
					<IpcrIndicator ipcrFunctionIndicator={indicator} />
				{/each}
			</DndContainer>
		</div>
	{/if}
</div>
