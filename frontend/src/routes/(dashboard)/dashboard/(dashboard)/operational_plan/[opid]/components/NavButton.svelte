<script>
	import { page } from '$app/stores';
	import NavButtonGroup from '$lib/magic-ui/Dock.svelte';
	import { getOperationalPlanStore } from '../states/current_operational_plan_state';
	import { getOperationalPlan } from '../utils/load_services';
	import CreateDialog from './sub_components/op_header/CreateDialog.svelte';
	import SubmitOp from './submit-op.svelte';

	let props = $props();

	const { canEdit } = getOperationalPlanStore();
</script>

<NavButtonGroup currentPath={$page.url.pathname}>
	<div class="group relative">
		<CreateDialog />
		{#if $canEdit}
			<SubmitOp submitIPCRForm={props} />
		{/if}
	</div>
</NavButtonGroup>
