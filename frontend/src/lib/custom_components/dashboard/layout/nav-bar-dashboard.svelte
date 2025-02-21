<!-- $lib/custom_components/dashboard/layout/nav-bar-dashboard.svelte -->
<script lang="ts">
	import { ChevronsRight } from 'lucide-svelte';
	import { page } from '$app/stores';
	import ThemeToggle from '$lib/custom_components/theme-toggle.svelte';
	import Notification from './components/notification.svelte';

	//states
	let currentPath = $state(['Dashboard']);
	//store

	$effect(() => {
		currentPath = $page.url.pathname.split('/').slice(1);
	});
	let { trigger } = $props();
</script>

<nav class="sticky top-0 z-10 min-h-14 w-full border-b shadow-md backdrop-blur-lg">
	<div class="w-full px-4 sm:px-6 lg:px-8">
		<div class="flex h-14 items-center justify-between">
			<div class="flex min-w-0 items-center space-x-4">
				<div class="lg:hidden">
					{@render trigger()}
				</div>
				<div class="md:text-md flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-sm">
					<div class="flex min-w-0 flex-1 items-center">
						{#each currentPath as path, i (i)}
							{#if i === 0}
								<a
									href={'/' + currentPath.slice(0, i + 1).join('/')}
									class="truncate capitalize hover:underline"
								>
									{path}
								</a>
							{:else}
								<div class="flex min-w-0 items-center gap-2">
									<ChevronsRight class="text-muted-foreground h-4 w-4 flex-shrink-0" />
									<a
										href={'/' + currentPath.slice(0, i + 1).join('/')}
										class="truncate capitalize hover:underline"
									>
										{path}
									</a>
								</div>
							{/if}
						{/each}
					</div>
				</div>
			</div>
			<div class="flex flex-shrink-0 items-center justify-between gap-8">
				<Notification />
				<ThemeToggle />
			</div>
		</div>
	</div>
</nav>
