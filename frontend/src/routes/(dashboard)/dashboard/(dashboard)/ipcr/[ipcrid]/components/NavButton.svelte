<script>
	import { page } from '$app/stores';
	import NavButtonGroup from '$lib/magic-ui/Dock.svelte';
	import { getIpcrStore } from '../states/current_ipcr_state';
	import CreateDialog from './sub_components/ipcr_function/CreateDialog.svelte';
	import SubmitIpcr from './SubmitIpcr.svelte';

	let { data } = $props();
	let isSubmitVisible = $state(false);

	const { canEdit } = getIpcrStore();
	$effect(() => {
		isSubmitVisible = $canEdit;
	});
</script>

<NavButtonGroup currentPath={$page.url.pathname}>
	<div class="group relative">
		<CreateDialog />
		{#if isSubmitVisible}
			<SubmitIpcr submitIPCRForm={data.submitForm} />
		{/if}
	</div>
</NavButtonGroup>
