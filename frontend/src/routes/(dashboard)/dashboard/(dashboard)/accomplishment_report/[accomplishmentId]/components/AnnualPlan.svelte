<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronDown } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import type { Tables } from '$lib/types/database.types';
	import { showWarningToast, showErrorToast } from '$lib/utils/toast';
	import type { AnnualPlanFormResult, HeaderFormResult } from '../utils/type';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import { getAccomplishmentAnnualPlanStore } from '../states/annual_plan_state';
	import { fetchActivity, fetchAnnualPlan } from '../utils/page_loader';
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import { slide } from 'svelte/transition';
	import { getAccomplishmentAnnualPlanFormContext } from '../states/annual_plan_form_state';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import TruncatedDiv from '../../../components/TruncatedDiv.svelte';
	import Update from './sub_components/annual_plan/Update.svelte';
	import { setAccomplishmentActivityStore } from '../states/activity_state';
	import Activity from './Activity.svelte';
	import Create from './sub_components/activity/Create.svelte';

	//props
	interface Iprops {
		annualPlan: Tables<'accomplishment_annual_plan'>;
	}
	let { annualPlan }: Iprops = $props();

	//stores
	const { deleteForm } = getAccomplishmentAnnualPlanFormContext();
	const { removeAccomplishmentAnnualPlan } = getAccomplishmentAnnualPlanStore();
	const { currentAccomplishmentActivities } = setAccomplishmentActivityStore();

	//states
	let dndItems = $state<Tables<'accomplishment_activity'>[]>([]);
	let isLoading = $state(false);
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let error = $state<string | undefined>();

	//functions
	function handleDelete(result: { type: string; data: AnnualPlanFormResult }) {
		if (result.data.accAnnualPlan) {
			const accAnnualPlan = result.data.accAnnualPlan;
			removeAccomplishmentAnnualPlan(accAnnualPlan.id);
			showWarningToast(`Successfully deleted ${accAnnualPlan.description}`);
		}
	}

	//activities
	const updateActivityPosition = async (
		items: Tables<'accomplishment_activity'>[]
	): Promise<void> => {
		const response = await fetch('/api/accomplishment_report/activity', {
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
		dndItems = $currentAccomplishmentActivities;
	});

	// Separate fetch function
	async function fetchData() {
		isLoading = true;
		error = undefined;

		try {
			const result = await fetchActivity(annualPlan.id);
			if (result.error) {
				error = result.error;
				showErrorToast(result.error);
				return;
			}
			dndItems = result.data;
			$currentAccomplishmentActivities = dndItems;
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
				<Badge variant={'secondary'} class="h-5 flex-shrink-0 bg-teal-400 text-xs"
					>Annual Plan</Badge
				>
				<div class="min-w-0 flex-1">
					<TruncatedDiv text={annualPlan.description} maxLength={50} />
				</div>
			</div>
		</div>
		<div class="ml-4 flex flex-shrink-0 items-center gap-5">
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={annualPlan.id}
					action="?/deleteannualplan"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateAction()}
				<Update accAnnualPlan={annualPlan} bind:isDrawerOpen />
			{/snippet}
			<div class="flex gap-4">
				<Create annualPlanId={annualPlan.id} bind:isExpanded onToggle={fetchData} />
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
				emptyMessage="No activities found"
				successMessage="Updated positions successfully"
				errorMessage="Failed to update order. Please try again."
			>
				{#each dndItems as activity (activity.id)}
					<Activity {activity} />
				{/each}
			</DndContainer>
		</div>
	{/if}
</div>
