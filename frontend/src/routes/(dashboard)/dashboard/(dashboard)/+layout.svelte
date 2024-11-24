<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/custom_components/side-bars/dashboard/side-bar.svelte';
	import NavBarDashboard from '$lib/custom_components/dashboard/layout/nav-bar-dashboard.svelte';
	let { children } = $props();
	let sidebarOpen = $state(false);
</script>

{#snippet trigger()}
	<Sidebar.Trigger />
{/snippet}
<Sidebar.Provider bind:open={sidebarOpen}>
	<AppSidebar bind:sidebarOpen />
	<div class="flex h-full w-full flex-col">
		<NavBarDashboard {trigger}></NavBarDashboard>
		<main class="flex-1 p-4">
			{@render children?.()}
		</main>
	</div>
</Sidebar.Provider>
