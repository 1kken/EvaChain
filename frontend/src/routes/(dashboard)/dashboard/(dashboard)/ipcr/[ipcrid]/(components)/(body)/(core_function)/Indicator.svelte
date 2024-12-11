<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { ChevronDown, LoaderCircle } from 'lucide-svelte';
	import { dndzone } from 'svelte-dnd-action';
	import type { DndEvent } from 'svelte-dnd-action';
	import debounce from 'debounce';
	import DeleteActionSubCoreFunction from './(subcomponents)/(delete_actions)/DeleteActionSubCoreFunction.svelte';
	import DropDownWrapper from '../../(wrappers)/DropDownWrapper.svelte';
	import SubCoreFunctionUpdateDialog from './(subcomponents)/(update_dialogs)/SubCoreFunctionUpdateDialog.svelte';
	import CreateIndicatorDialog from '../../(indicator)/CreateIndicatorDialog.svelte';
	import IndicatorComponent from '../../(indicator)/IndicatorComponent.svelte';
	import { setIndicatorStore } from '../../(data)/(state)/indicator_state.svelte';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { fetchIndicatorsByParam } from '../../../utils/fetching_utils';
	import type { Tables } from '$lib/types/database.types';
	import { getSingleIPCRStore } from '../../(data)/(state)/ipcr-state.svelte';

	type Indicator = Tables<'indicator'>;

	interface Props {
		name: string;
		sub_core_function_id: string;
	}
	// Props
	let { name, sub_core_function_id }: Props = $props();

	// States
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let isLoading = $state(false);
	let isUpdating = $state(false);
	let indicators = $state<Indicator[]>([]);
	let dndItems = $state<Indicator[]>([]);
	const flipDurationMs = 300;

	//store
	const { canEdit } = getSingleIPCRStore();

	// Initialize store when component mounts
	const store = setIndicatorStore();
	const { currentIndicators } = store;

	const updateIndicatorPositions = debounce(async (items: Indicator[]) => {
		try {
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

			const result = await response.json();
			return result.data;
		} catch (error) {
			console.error('Error updating positions:', error);
			throw error;
		}
	}, 2000);

	function handleDndConsider(e: CustomEvent<DndEvent<Indicator>>) {
		const updatedItems = e.detail.items.map((item, index) => ({
			...item,
			position: (index + 1) * 100
		}));
		dndItems = updatedItems;
	}

	async function handleDndFinalize(e: CustomEvent<DndEvent<Indicator>>) {
		try {
			isUpdating = true;
			const updatedItems = e.detail.items.map((item, index) => ({
				...item,
				position: (index + 1) * 100
			}));

			await updateIndicatorPositions(updatedItems);
			$currentIndicators = updatedItems;
			indicators = updatedItems;
			showSuccessToast('Updated Indicator Position');
		} catch (error) {
			console.error('Failed to update positions:', error);
			showErrorToast('Failed to update order. Please try again.');
			dndItems = [...indicators];
		} finally {
			isUpdating = false;
		}
	}

	async function fetchIndicators(): Promise<void> {
		try {
			isLoading = true;
			const result = await fetchIndicatorsByParam({
				url_params: 'sub_core_function_id',
				id: sub_core_function_id
			});

			if (result.error) {
				throw new Error(result.error);
			}

			indicators = result.data;
			dndItems = result.data;
			$currentIndicators = result.data;
		} catch (error) {
			console.error('Error fetching indicators:', error);
			showErrorToast('Failed to load indicators');
		} finally {
			isLoading = false;
		}
	}

	async function toggleExpand() {
		isExpanded = !isExpanded;
		if (isExpanded && indicators.length === 0) {
			await fetchIndicators();
		}
	}

	$effect(() => {
		if (!isUpdating && !isLoading) {
			const newData = $currentIndicators;
			indicators = newData;
			dndItems = newData;
		}
	});
</script>

<div class="rounded-lg border">
	<div class="flex min-h-[3.5rem] items-center justify-between p-3">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" class=" md:flex" onclick={toggleExpand}>
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
				<DeleteActionSubCoreFunction subCoreFunctionId={sub_core_function_id} bind:isDrawerOpen />
			{/snippet}
			{#snippet updateDialog()}
				<SubCoreFunctionUpdateDialog subCoreFunctionId={sub_core_function_id} bind:isDrawerOpen />
			{/snippet}
			<div class="flex gap-4">
				<CreateIndicatorDialog config={{ type: 'sub_core_function', id: sub_core_function_id }} />
				<DropDownWrapper childrens={[updateDialog, deleteAction]} bind:isDrawerOpen />
			</div>
		{/if}
	</div>

	{#if isExpanded}
		<div class="border-t p-3">
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
						<div class="text-center text-gray-500">No indicators found</div>
					{:else}
						{#each dndItems as indicator (indicator.id)}
							<div class="py-2">
								<IndicatorComponent {indicator} />
							</div>
						{/each}
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>
