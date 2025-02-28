<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { showWarningToast } from '$lib/utils/toast';
	import TruncatedDiv from '../../../components/TruncatedDiv.svelte';
	import { getStrategyPerformanceIndicatorFormContext } from '../states/performance_indicator_form_state';
	import { getStrategyPerformanceIndicatorStore } from '../states/performance_indicator_state';
	import { getCurrentStrategicPlanStore } from '../states/strategic_plan_state';
	import type { PerformanceIndicatorFormResult } from '../utils/types';
	import Update from './sub_components/performance_indicator/update.svelte';

	let { indicator }: { indicator: Tables<'strategy_plan_performance_indicator'> } = $props();
	//states
	let isDrawerOpen = $state(false);

	//store
	const { removePerformanceIndicator } = getStrategyPerformanceIndicatorStore();
	const { currentStrategicPlan } = getCurrentStrategicPlanStore();
	const { deleteForm } = getStrategyPerformanceIndicatorFormContext();

	//functions
	function handleDelete(result: { type: string; data: PerformanceIndicatorFormResult }) {
		if (result.data.performanceIndicator) {
			const performanceIndicator = result.data.performanceIndicator;
			removePerformanceIndicator(performanceIndicator.id);
			showWarningToast(`Successfully deleted performance indicator`);
		}
	}

	const isPublished = $derived($currentStrategicPlan?.strategic.status === 'published');
</script>

<div class="rounded-lg border">
	<header class=" top-0 flex h-10 items-center justify-between p-7 md:px-10">
		<div class="flex items-start gap-5 pr-4">
			<Badge variant={'secondary'} class="h-5 bg-amber-500 text-xs">Indicator</Badge>
			<TruncatedDiv text={indicator.performance_indicator} maxLength={50} />
			<!-- <ViewActivity {activity} /> -->
		</div>
		{#if !isPublished}
			<div class="flex items-center gap-5">
				{#snippet deleteAction()}
					<UniversalDeleteAction
						id={indicator.id}
						action="?/deleteindicator"
						data={deleteForm}
						onDelete={handleDelete}
					/>
				{/snippet}
				{#snippet updateAction()}
					<Update {indicator} bind:isDrawerOpen />
				{/snippet}
				<div class="flex gap-4">
					<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
				</div>
			</div>
		{/if}
	</header>
</div>
