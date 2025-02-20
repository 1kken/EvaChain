<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronDown } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import type { Tables } from '$lib/types/database.types';
	import { showWarningToast, showErrorToast } from '$lib/utils/toast';
	import type { ActivityFormResult, AnnualPlanFormResult, HeaderFormResult } from '../utils/type';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import { fetchIndicator } from '../utils/page_loader';
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import { slide } from 'svelte/transition';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import TruncatedDiv from '../../../components/TruncatedDiv.svelte';
	import { getAccomplishmentActivityStore } from '../states/activity_state';
	import { getAccomplishmentActivityFormContext } from '../states/activity_form_state';
	import { setAccomplishmentActivityIndicatorStore } from '../states/activity_indicator_state';
	import Update from './sub_components/activity/Update.svelte';
	import Indicator from './Indicator.svelte';
	import Create from './sub_components/indicator/Create.svelte';

	//props
	let { activity }: { activity: Tables<'accomplishment_activity'> } = $props();

	//stores
	const { removeAccomplishmentActivity } = getAccomplishmentActivityStore();
	const { deleteForm } = getAccomplishmentActivityFormContext();
	const { currentAccomplishmentActivityIndicators } = setAccomplishmentActivityIndicatorStore();
	//states
	let dndItems = $state<Tables<'accomplishment_activity_indicator'>[]>([]);
	let isLoading = $state(false);
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let error = $state<string | undefined>();

	//functions
	function handleDelete(result: { type: string; data: ActivityFormResult }) {
		if (result.data.accActivity) {
			const resActivity = result.data.accActivity;
			removeAccomplishmentActivity(resActivity.id);
			showWarningToast(`Successfully deleted ${resActivity.activity}`);
		}
	}
	//activities
	const updateActivityPosition = async (
		items: Tables<'accomplishment_activity'>[]
	): Promise<void> => {
		const response = await fetch('/api/accomplishment_report/indicator', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(items)
		});

		if (!response.ok) {
			throw new Error('Failed to update positions');
		}
	};

	$effect(() => {
		dndItems = $currentAccomplishmentActivityIndicators;
	});

	// Separate fetch function
	async function fetchData() {
		isLoading = true;
		error = undefined;

		try {
			const result = await fetchIndicator(activity.id);
			if (result.error) {
				error = result.error;
				showErrorToast(result.error);
				return;
			}
			dndItems = result.data;
			$currentAccomplishmentActivityIndicators = dndItems;
		} catch (e) {
			error = e instanceof Error ? e.message : 'An unknown error occurred';
			showErrorToast(error);
		} finally {
			isLoading = false;
		}
	}

	// Simplified toggle function
	async function toggleExpand() {
		isExpanded = !isExpanded;

		if (isExpanded && dndItems.length === 0) {
			await fetchData();
		}
	}
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
				<Badge variant={'secondary'} class="h-5 flex-shrink-0 bg-green-400 text-xs"
					>Annual Plan</Badge
				>
				<div class="min-w-0 flex-1">
					<TruncatedDiv text={activity.activity} maxLength={50} />
				</div>
			</div>
		</div>
		<div class="ml-4 flex flex-shrink-0 items-center gap-5">
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={activity.id}
					action="?/deleteactivity"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateAction()}
				<Update {activity} bind:isDrawerOpen />
			{/snippet}
			<div class="flex gap-4">
				<Create activityId={activity.id} bind:isExpanded onToggle={fetchData} />
				<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
			</div>
		</div>
	</div>

	{#if isExpanded}
		<div class="border-t p-4" transition:slide={{ duration: 300 }}>
			<DndContainer
				{isLoading}
				bind:items={dndItems}
				onPositionsUpdate={updateActivityPosition}
				emptyMessage="No Indicators found."
				successMessage="Updated positions successfully."
				errorMessage="Failed to update order. Please try again."
			>
				{#each dndItems as indicator (indicator.id)}
					<Indicator {indicator} />
				{/each}
			</DndContainer>
		</div>
	{/if}
</div>
