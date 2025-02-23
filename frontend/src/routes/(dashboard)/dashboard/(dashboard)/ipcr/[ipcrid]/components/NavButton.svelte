<script>
	import { page } from '$app/stores';
	import NavButtonGroup from '$lib/magic-ui/Dock.svelte';
	import { getIpcrStore } from '../states/current_ipcr_state';
	import CreateDialog from './sub_components/ipcr_function/CreateDialog.svelte';
	import SubmitIpcr from './SubmitIpcr.svelte';

	let { data } = $props();

	const { isDraft, isReviewedRaw, isRevisionRaw, isRevision } = getIpcrStore();
	let canSubmit = $state($isDraft || $isReviewedRaw || $isRevisionRaw || $isRevision);
</script>

<NavButtonGroup currentPath={$page.url.pathname}>
	<div class="group relative">
		<CreateDialog />
		{#if canSubmit}
			<SubmitIpcr submitIPCRForm={data.submitForm} />
		{/if}
	</div>
</NavButtonGroup>
