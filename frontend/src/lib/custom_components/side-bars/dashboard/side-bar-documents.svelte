<script lang="ts">
	import { page } from '$app/stores';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { ScrollText } from 'lucide-svelte';

	const items = [
		{
			title: 'IPCR (Individual Performance Commitment Review)',
			url: `/dashboard/ipcr/${$page.data.session?.user.id}`,

			icon: ScrollText
		}
	];
	function isActive(itemUrl: string) {
		return $page.url.pathname === itemUrl;
	}
</script>

<Sidebar.Menu>
	{#each items as item (item.title)}
		<Sidebar.MenuItem>
			<Sidebar.MenuButton class={isActive(item.url) ? 'font-bold' : ''}>
				{#snippet child({ props })}
					<a href={item.url} {...props}>
						<item.icon />
						<span class="text-xs">{item.title}</span>
					</a>
				{/snippet}
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
	{/each}
</Sidebar.Menu>
