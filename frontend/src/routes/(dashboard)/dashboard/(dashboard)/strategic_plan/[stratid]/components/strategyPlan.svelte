<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronDown } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import type { Tables } from '$lib/types/database.types';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import { showWarningToast, showErrorToast } from '$lib/utils/toast';
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import { slide } from 'svelte/transition';
	import { getStrategyPlanStore } from '../states/strategy_plan_state';
	import { getStrategyPlanFormContext } from '../states/strategy_plan_form_state';
	import type { StrategyPlanFormResult } from '../utils/types';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import Update from './sub_components/strategy_plan/update.svelte';
	import TruncatedDiv from '../../../components/TruncatedDiv.svelte';
	import { fetchStrategyPerformanceIndicatorForms } from '../utils/page_server_load';
	import { fetchPerformanceIndicator } from '../utils/page_load';
	import { setStrategyPerformanceIndicatorStore } from '../states/performance_indicator_state';
	import Create from './sub_components/performance_indicator/create.svelte';
	import PerformanceIndicator from './performanceIndicator.svelte';

	//props
	interface Iprops {
		strategyPlan: Tables<'strategy_plan'>;
	}
	let { strategyPlan }: Iprops = $props();

	//stores
	const { removeStrategyPlan } = getStrategyPlanStore();
	const { deleteForm } = getStrategyPlanFormContext();
	const { currentPerformanceIndicators } = setStrategyPerformanceIndicatorStore();

	//states
	let dndItems = $state<Tables<'strategy_plan_performance_indicator'>[]>([]);
	let isLoading = $state(false);
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let error = $state<string | null>(null);

	//functions
	function handleDelete(result: { type: string; data: StrategyPlanFormResult }) {
		if (result.data.strategyPlan) {
			const strategyPlan = result.data.strategyPlan;
			removeStrategyPlan(strategyPlan.id);
			showWarningToast(`Successfully deleted strategy plan`);
		}
	}

	const updateIndicatorPosition = async (
		items: Tables<'strategy_plan_performance_indicator'>[]
	): Promise<void> => {
		const response = await fetch('/api/strategic_plan/performance_indicator', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(items)
		});

		if (!response.ok) {
			throw new Error('Failed to update positions');
		}

		$currentPerformanceIndicators = items;
	};

	$effect(() => {
		dndItems = $currentPerformanceIndicators;
	});

	// Separate fetch function
	async function fetchData() {
		isLoading = true;
		error = null;

		try {
			const result = await fetchPerformanceIndicator(strategyPlan.id);
			if (result.error) {
				error = result.error;
				showErrorToast(result.error);
				return;
			}
			dndItems = result.data;
			$currentPerformanceIndicators = result.data;
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
			<TruncatedDiv text={strategyPlan.description} maxLength={50} />
		</div>
		<div class="flex items-center gap-5">
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={strategyPlan.id}
					action="?/deletestrategyplan"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateAction()}
				<Update {strategyPlan} bind:isDrawerOpen />
			{/snippet}
			<div class="flex gap-4">
				<Create strategyPlanId={strategyPlan.id} bind:isExpanded onToggle={fetchData} />
				<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
			</div>
		</div>
	</header>

	{#if isExpanded}
		<div class="p-4" transition:slide={{ duration: 300 }}>
			{#if isLoading}
				<div class="flex justify-center">Loading program indicators...</div>
			{:else if error}
				<div class="text-destructive text-center">
					{error}
				</div>
			{:else if dndItems.length === 0}
				<div class="text-muted-foreground text-center">No Annual Plans Found</div>
			{:else}
				<DndContainer
					bind:items={dndItems}
					onPositionsUpdate={updateIndicatorPosition}
					emptyMessage="No Annual Plans Found"
				>
					{#each dndItems as indicator (indicator.id)}
						<PerformanceIndicator {indicator} />
					{/each}
				</DndContainer>
			{/if}
		</div>
	{/if}
</div>
