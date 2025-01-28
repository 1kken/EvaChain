<script>
	import { page } from '$app/stores';
	import NavButtonGroup from '$lib/magic-ui/Dock.svelte';
	import Create from './sub_components/strategy_plan/create.svelte';
</script>

<NavButtonGroup currentPath={$page.url.pathname}>
	<div class="group relative">
		<Create />
	</div>
</NavButtonGroup>
