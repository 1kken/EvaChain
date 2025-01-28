<script lang="ts">
	import Header from '../../components/Header.svelte';
	import type { PageData } from './$types';
	import Index from './components/index.svelte';
	import NavButton from './components/NavButton.svelte';
	import { setStrategyPerformanceIndicatorFormContext } from './states/performance_indicator_form_state';
	import { setCurrentStrategicPlanStore } from './states/strategic_plan_state';
	import { setStrategyPlanFormContext } from './states/strategy_plan_form_state';
	import { setStrategyPlanStore } from './states/strategy_plan_state';

	let { data }: { data: PageData } = $props();

	const strategyPlanForms = data.forms.strategyPlanForm;
	const performanceIndicatorForms = data.forms.strategyPlanPerfIndicatorForm;
	//forms
	setStrategyPlanFormContext(strategyPlanForms);
	setStrategyPerformanceIndicatorFormContext(performanceIndicatorForms);

	//data
	setCurrentStrategicPlanStore(data.strategicPlan);
	setStrategyPlanStore(data.strategyPlans);
</script>

<!-- Main wrapper -->
<div class="relative min-h-screen pb-24">
	<!-- Main content -->
	<div class="h-full w-full">
		<Header title={'Strategic Plan'} description={'Create and Manage strategic plan'} />
		<Index />
	</div>

	<!-- Navigation dock -->
	<div class="fixed bottom-6 left-0 right-0 z-50 flex justify-center">
		<NavButton />
	</div>
</div>
