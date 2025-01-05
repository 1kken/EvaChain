<script>
	import { page } from '$app/stores';
	import NavButtonGroup from '$lib/magic-ui/Dock.svelte';
	import PublishTemplate from './PublishTemplate.svelte';
	import Create from './sub_components/program_project/Create.svelte';
</script>

<NavButtonGroup currentPath={$page.url.pathname}>
	<div class="group relative">
		<Create />
		<PublishTemplate />
	</div>
</NavButtonGroup>
