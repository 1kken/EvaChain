<script lang="ts">
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { titleCase } from 'title-case';
	import { getStrategicPlanStore } from '../../(data)/strat_plan_state';
	import { getCurrentStrategicPlanStore } from '../states/strategic_plan_state';
	import { getStrategyPlanStore } from '../states/strategy_plan_state';
	import StrategyPlan from './strategyPlan.svelte';

	//stores
	const { currentStrategyPlans } = getStrategyPlanStore();
	const { currentStrategicPlan } = getCurrentStrategicPlanStore();
	//states
	let dndItems = $state<Tables<'strategy_plan'>[]>([]);

	$effect(() => {
		dndItems = $currentStrategyPlans;
	});

	const updateStrategyPlanPosition = async (items: Tables<'strategy_plan'>[]): Promise<void> => {
		const response = await fetch('/api/strategic_plan/strategy_plan', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(items)
		});

		if (!response.ok) {
			throw new Error('Failed to update positions');
		}
		$currentStrategyPlans = items;
	};
</script>

<div class="w-full">
	<header class="sticky top-0 flex h-10 items-center justify-between border-b px-4 md:px-10">
		<div class="flex items-center gap-2">
			<span class="text-lg font-bold">
				{titleCase($currentStrategicPlan?.strategic.major_output ?? 'Error')}
			</span>
		</div>
	</header>

	<DndContainer
		bind:items={dndItems}
		onPositionsUpdate={updateStrategyPlanPosition}
		emptyMessage="No Strategy Plan found"
		successMessage="Successfully Updated Strategy Plan Position"
		errorMessage="Failed to Update Strategy Plan Position. Please try again"
	>
		{#each dndItems as strategyPlan (strategyPlan.id)}
			<div class="mt-2">
				<StrategyPlan {strategyPlan} />
			</div>
		{/each}
	</DndContainer>
</div>
