<script>
	import { page } from '$app/stores';
	import NavButtonGroup from '$lib/magic-ui/Dock.svelte';
	import CreateDialog from './sub_components/op_header/CreateDialog.svelte';
	import SubmitOp from './submit-op.svelte';

	let props = $props();
</script>

<NavButtonGroup currentPath={$page.url.pathname}>
	<div class="group relative">
		<CreateDialog />
		<SubmitOp submitIPCRForm={props} />
	</div>
</NavButtonGroup>
