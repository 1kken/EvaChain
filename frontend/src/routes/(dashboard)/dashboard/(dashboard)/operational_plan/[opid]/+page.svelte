<script lang="ts">
	import type { PageData } from './$types';
	import { setOperationalPlanStore } from './states/current_operational_plan_state';
	import { setOpHeaderFormContext } from './states/op_header_form_state';
	import { setOpHeaderStore } from './states/op_header_state';
	import IndexComponent from './components/IndexComponent.svelte';
	import NavButton from './components/NavButton.svelte';
	import { setOpProgramProjectFormContext } from './states/op_program_project_form_state';
	import { setOpObjectiveFormContext } from './states/op_objective_form_state';

	let { data }: { data: PageData } = $props();

	//set states
	setOperationalPlanStore(data.operationalPlan);
	//header
	setOpHeaderStore(data.opHeaders);
	setOpHeaderFormContext(data.opHeaderForms);
	//program project
	setOpProgramProjectFormContext(data.opProgramProjectForms);
	//objectives
	setOpObjectiveFormContext(data.opProgramObjectiveForms);
</script>

<!-- Main wrapper -->
<div class="relative min-h-screen pb-24">
	<!-- Main content -->
	<div class="h-full w-full">
		<IndexComponent />
	</div>

	<!-- Navigation dock -->
	<div class="fixed bottom-6 left-0 right-0 z-50 flex justify-center">
		<NavButton />
	</div>
</div>
