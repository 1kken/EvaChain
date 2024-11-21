<!-- $lib/custom_components/dashboard/layout/nav-bar-dashboard.svelte -->
<script>
	import { Bell } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';

	let notificationCount = $state(3);
	let currentPath = $state(['Dashboard']);

	$effect(() => {
		currentPath = $page.url.pathname.split('/').slice(1);
	});
	let { trigger } = $props();
</script>

<nav class="sticky top-0 z-10 min-h-14 w-full border-b shadow-md backdrop-blur-lg">
	<div class="w-full px-4 sm:px-6 lg:px-8">
		<div class="flex h-14 items-center justify-between">
			<div class="flex items-center space-x-4">
				<div class="lg:hidden">
					{@render trigger()}
				</div>
				<span class=" text-md">
					{#each currentPath as path, i (i)}
						{#if i === 0}
							<a href={'/' + currentPath.slice(0, i + 1).join('/')} class="capitalize">{path}</a>
						{:else}
							<a href={'/' + currentPath.slice(0, i + 1).join('/')} class="capitalize">/{path}</a>
						{/if}
					{/each}
				</span>
			</div>
			<div class="flex items-center">
				<Button variant="ghost" size="icon" class="relative">
					<Bell class="h-5 w-5" />
					{#if notificationCount > 0}
						<span
							class="absolute right-0 top-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"
						></span>
					{/if}
				</Button>
			</div>
		</div>
	</div>
</nav>
