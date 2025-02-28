<script lang="ts">
	import { page } from '$app/stores';
	import NavButtonGroup from '$lib/magic-ui/Dock.svelte';
	import Publish from './sub_components/publish/publish.svelte';
	import Create from './sub_components/strategy_plan/create.svelte';

	let { data } = $props();
</script>

<NavButtonGroup currentPath={$page.url.pathname}>
	<div class="group relative">
		<Create />
		<Publish publishForm={data.publishForm} />
	</div>
</NavButtonGroup>
