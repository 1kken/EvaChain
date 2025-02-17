<script lang="ts">
	import type { PageData } from './$types';
	import { setOperationalPlanStore } from './states/current_operational_plan_state';
	import { setOpHeaderFormContext } from './states/op_header_form_state';
	import { setOpHeaderStore } from './states/op_header_state';
	import IndexComponent from './components/IndexComponent.svelte';
	import NavButton from './components/NavButton.svelte';
	import { setOpActivityFormContext } from './states/op_activity_form_state';
	import Header from '../../components/Header.svelte';
	import { setOpAnnualPlanFormContext } from './states/op_annual_plan_form_state';
	import { setOpIndicatorFormContext } from './states/op_indicator_form_state';

	let { data }: { data: PageData } = $props();

	//set states
	setOperationalPlanStore(data.operationalPlan);
	//header
	setOpHeaderStore(data.opHeaders);
	setOpHeaderFormContext(data.opHeaderForms);
	//annual plan
	setOpAnnualPlanFormContext(data.opAnnualPlanForms);
	//activities
	setOpActivityFormContext(data.opActivityForms);
	//indicator
	setOpIndicatorFormContext(data.opIndicatorForms);
</script>

<!-- Main wrapper -->
<div class="relative min-h-screen pb-24">
	<!-- Main content -->
	<div class="h-full w-full">
		<Header
			title={'Operational Plan'}
			description={'Manage objective,activities, budget management, and quarterly assignment'}
		/>
		<IndexComponent />
	</div>

	<!-- Navigation dock -->
	<div class="fixed bottom-6 left-0 right-0 z-50 flex justify-center">
		<NavButton />
	</div>
</div>
