<script lang="ts">
	import { page } from '$app/stores';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { getUserAuthStore } from '$lib/utils/rbac';
	import {
		NotebookPen,
		ScrollText,
		ClipboardCheck,
		NotebookText,
		BookOpenCheck,
		FileCheck2
	} from 'lucide-svelte';

	const { hasPermission } = getUserAuthStore();
	const items = [
		{
			title: 'IPCR',
			url: `/dashboard/ipcr`,
			icon: ScrollText
		},
		{
			title: 'Accomplishment Report',
			url: `/dashboard/accomplishment_report`,
			icon: ClipboardCheck
		}
	];

	//for dpcr
	if (hasPermission('create_dpcr')) {
		items.push({
			title: 'DPCR',
			url: `/dashboard/dpcr`,
			icon: NotebookText
		});
	}

	//for strategic plan
	if (hasPermission('create_strategic_plan')) {
		items.push({
			title: 'Strategic Plan',
			url: `/dashboard/strategic_plan`,
			icon: BookOpenCheck
		});
	}

	//for opcr
	if (hasPermission('create_opcr')) {
		items.push({
			title: 'OPCR',
			url: `/dashboard/opcr`,
			icon: FileCheck2
		});
	}

	//for operational plan
	if (
		hasPermission('office_create_operational_plan') ||
		hasPermission('program_create_operational_plan') ||
		hasPermission('unit_create_operational_plan')
	) {
		items.push({
			title: 'Operational Plan',
			url: `/dashboard/operational_plan`,
			icon: NotebookPen
		});
	}
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
