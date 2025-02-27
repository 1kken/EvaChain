<script lang="ts">
	import { page } from '$app/stores';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { ScrollText } from 'lucide-svelte';
	import { getUserAuthStore } from '$lib/utils/rbac';
	const { hasPermission } = getUserAuthStore();
	type MenuItem = {
		title: string; // The display text of the menu item
		url: string; // The URL/route the menu item links to
		icon: any; // The Lucide icon component to display
	};
	const items: MenuItem[] = [];
	if (
		hasPermission('unit_view_ipcr') ||
		hasPermission('office_view_ipcr') ||
		hasPermission('program_view_ipcr')
	) {
		items.push({
			title: 'IPCR',
			url: '/dashboard/view/ipcr',
			icon: ScrollText
		});
	}

	function isActive(itemUrl: string) {
		return $page.url.pathname === itemUrl;
	}
</script>

{#if items.length > 0}
	<Sidebar.Group>
		<Sidebar.GroupLabel>Monitor Documents</Sidebar.GroupLabel>
		<Sidebar.GroupContent>
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
		</Sidebar.GroupContent>
	</Sidebar.Group>
{/if}
