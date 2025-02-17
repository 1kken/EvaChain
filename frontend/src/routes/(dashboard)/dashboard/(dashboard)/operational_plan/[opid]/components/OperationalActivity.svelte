<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { Tables } from '$lib/types/database.types';
	import { cn } from '$lib/utils';
	import { slide } from 'svelte/transition';
	import { ChevronDown } from 'lucide-svelte';
	import { showErrorToast, showWarningToast } from '$lib/utils/toast';
	import { fetchOpActivities, fetchOpIndicators } from '../utils/page_load_services';
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import { getOpActivityStore, setOpActivityStore } from '../states/op_activity_state';
	import OperationalActivity from './OperationalActivity.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import TruncatedDiv from '../../../components/TruncatedDiv.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import { getOpActivityFormContext } from '../states/op_activity_form_state';
	import { setOpIndicatorStore } from '../states/op_indicator_state';
	import UpdateDialog from './sub_components/op_activity/UpdateDialog.svelte';
	import CreateDialog from './sub_components/op_indicator/CreateDialog.svelte';
	import OpIndicator from './OpIndicator.svelte';

	//props
	let { opActivity }: { opActivity: Tables<'op_activity'> } = $props();

	//states
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let dndItems: Tables<'op_activity_indicator'>[] = $state([]);

	//store
	const { removeOpActivity } = getOpActivityStore();
	const { deleteForm } = getOpActivityFormContext();
	const { currentOpIndicators } = setOpIndicatorStore();

	// Separate fetch function
	async function fetchData() {
		isLoading = true;
		error = null;

		try {
			const result = await fetchOpIndicators(opActivity.id);
			if (result.error) {
				error = result.error;
				showErrorToast(result.error);
				return;
			}
			dndItems = result.data;
			$currentOpIndicators = result.data;
		} catch (e) {
			error = e instanceof Error ? e.message : 'An unknown error occurred';
			showErrorToast(error);
		} finally {
			isLoading = false;
		}
	}

	//sync with store
	$effect(() => {
		dndItems = $currentOpIndicators;
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
		if (result.data.opActivity) {
			const opActivity = result.data.opActivity;
			removeOpActivity(opActivity.id);
			showWarningToast(`Successfully deleted ${opActivity.activity}`);
		}
	}

	const updateOpIndicatorPosition = async (
		items: Tables<'op_activity_indicator'>[]
	): Promise<void> => {
		const response = await fetch('/api/operational_plan/indicator', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(items)
		});

		if (!response.ok) {
			throw new Error('Failed to update positions');
		}

		$currentOpIndicators = items;
	};
</script>

<div class="rounded-lg border">
	<div class="flex h-10 items-center justify-between p-7 {isExpanded ? 'h-auto min-h-10' : ''}">
		<div class="flex items-center gap-2 {isExpanded ? 'items-start' : ''}">
			<Button variant="ghost" size="icon" onclick={toggleExpand} class={isExpanded ? 'mt-0.5' : ''}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<div class="flex items-center gap-2">
				<Badge variant={'secondary'} class="h-5 flex-shrink-0 bg-green-400 text-xs">Activity</Badge>
				<div class="min-w-0 flex-1">
					<TruncatedDiv text={opActivity.activity} maxLength={50} />
				</div>
			</div>
		</div>
		<div class="ml-4 flex flex-shrink-0 items-center gap-5">
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={opActivity.id}
					action="?/deleteopactivity"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateAction()}
				<UpdateDialog bind:isDrawerOpen {opActivity} />
			{/snippet}
			<div class="flex gap-4">
				<CreateDialog opActivityId={opActivity.id} onToggle={fetchData} bind:isExpanded />
				<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
			</div>
		</div>
	</div>

	{#if isExpanded}
		<div class="border-t p-4" transition:slide={{ duration: 300 }}>
			<DndContainer
				{isLoading}
				bind:items={dndItems}
				onPositionsUpdate={updateOpIndicatorPosition}
				emptyMessage="No Indicators Found"
				successMessage="Updated positions successfully"
				errorMessage="Failed to update order. Please try again."
			>
				{#each dndItems as item (item.id)}
					<OpIndicator opIndicator={item} />
				{/each}
			</DndContainer>
		</div>
	{/if}
</div>
