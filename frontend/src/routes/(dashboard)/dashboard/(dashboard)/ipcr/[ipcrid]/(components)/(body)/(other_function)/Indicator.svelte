<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { ChevronDown } from 'lucide-svelte';
	import DropDownWrapper from '../../(wrappers)/DropDownWrapper.svelte';
	import CreateIndicatorDialog from '../../(indicator)/CreateIndicatorDialog.svelte';
	import IndicatorComponent from '../../(indicator)/IndicatorComponent.svelte';
	import { setIndicatorStore } from '../../(data)/(state)/indicator_state.svelte';
	import { showErrorToast } from '$lib/utils/toast';
	import { fetchIndicatorsByParam } from '../../../utils/fetching_utils';
	import type { Tables } from '$lib/types/database.types';
	import { getSingleIPCRStore } from '../../(data)/(state)/ipcr-state.svelte';
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import SubOtherFunctionDeleteAction from './(subcomponents)/(delete_actions)/SubOtherFunctionDeleteAction.svelte';
	import SubOtherFunctionUpdateDialog from './(subcomponents)/(update_dialogs)/SubOtherFunctionUpdateDialog.svelte';
	// import SubSupportDeleteAction from './(subcomponents)/(delete_actions)/SubSupportDeleteAction.svelte';
	// import SubSupportUpdateDialog from './(subcomponents)/(update_dialogs)/SubSupportUpdateDialog.svelte';

	type Indicator = Tables<'indicator'>;

	interface Props {
		name: string;
		sub_other_function_id: string;
	}

	// Props
	let { name, sub_other_function_id }: Props = $props();

	// States
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let isLoading = $state(false);
	let dndItems = $state<Indicator[]>([]);

	// Store initialization
	const { canEdit } = getSingleIPCRStore();
	const { currentIndicators } = setIndicatorStore();

	// API Functions
	const updateIndicatorPositions = async (items: Indicator[]): Promise<void> => {
		const response = await fetch('/api/indicator', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(items)
		});

		if (!response.ok) {
			throw new Error('Failed to update positions');
		}

		$currentIndicators = items;
	};

	async function fetchIndicators(): Promise<void> {
		try {
			isLoading = true;
			const result = await fetchIndicatorsByParam({
				url_params: 'sub_other_function_id',
				id: sub_other_function_id
			});

			if (result.error) {
				throw new Error(result.error);
			}

			dndItems = result.data;
			$currentIndicators = result.data;
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
			dndItems = [...$currentIndicators];
		}
	});
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
			<h4 class="font-medium">{name}</h4>
		</div>
		{#if $canEdit}
			{#snippet deleteAction()}
				<SubOtherFunctionDeleteAction
					subOtherFunctionId={sub_other_function_id}
					bind:isDrawerOpen
				/>
			{/snippet}
			{#snippet updateDialog()}
				<SubOtherFunctionUpdateDialog
					subOtherFunctionId={sub_other_function_id}
					bind:isDrawerOpen
				/>
			{/snippet}
			<div class="flex gap-4">
				<CreateIndicatorDialog config={{ type: 'sub_other_function', id: sub_other_function_id }} />
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
					<IndicatorComponent {indicator} />
				{/each}
			</DndContainer>
		</div>
	{/if}
</div>
