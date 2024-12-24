<script>
	import { page } from '$app/stores';
	import NavButtonGroup from '$lib/magic-ui/Dock.svelte';
	import CreateDialog from './sub_components/ipcr_function/CreateDialog.svelte';
</script>

<NavButtonGroup currentPath={$page.url.pathname}>
	<div class="group relative">
		<CreateDialog />
	</div>
</NavButtonGroup>
