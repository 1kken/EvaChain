<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import SideBarHeader from '$lib/custom_components/side-bars/side-bar-header.svelte';
	import SideBarFooter from '$lib/custom_components/side-bars/side-bar-footer.svelte';

	let { sidebarOpen = $bindable() } = $props();

	let isHover = $state(false);
	let isDrawerOpen = $state(false);

	function handleChange() {
		const open = isHover || isDrawerOpen;
		sidebarOpen = open;
	}
</script>

<Sidebar.Root
	collapsible={'icon'}
	onmouseover={() => {
		isHover = true;
		handleChange();
	}}
	onmouseleave={() => {
		isHover = false;
		handleChange();
	}}
>
	<SideBarHeader />
	<Sidebar.Separator />
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Document Management</Sidebar.GroupLabel>
			<Sidebar.GroupContent></Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<SideBarFooter bind:isDrawerOpen />
</Sidebar.Root>
