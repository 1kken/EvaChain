<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { BookCheck, ChevronRight, DatabaseBackup, FilePlus2 } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	const items = [
		{
			title: 'Operational Plan',
			url: `/dashboard/approval_request/operational_plan`
		},
		{
			title: 'IPCR',
			url: `/dashboard/approval_request/ipcr`
		}
	];
	function isActive(itemUrl: string) {
		return $page.url.pathname === itemUrl;
	}

	let isOpen = $state(false);
</script>

<Sidebar.Menu>
	<Collapsible.Root bind:open={isOpen} class="group/collapsible">
		<Sidebar.MenuItem>
			<Collapsible.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton {...props} isActive={isOpen} class="flex space-x-8 ">
						<BookCheck />
						<div class="flex w-full justify-between">
							<span class="text-xs">Document Approval</span>
							<ChevronRight
								class={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
							/>
						</div>
					</Sidebar.MenuButton>
				{/snippet}
			</Collapsible.Trigger>
			<Collapsible.Content forceMount>
				{#snippet child({ props, open })}
					{#if open}
						<div {...props} transition:fade>
							<Sidebar.MenuSub>
								{#each items as item (item.title)}
									<Sidebar.MenuSubItem>
										<Sidebar.MenuSubButton class={isActive(item.url) ? 'font-bold' : ''}>
											{#snippet child({ props })}
												<a href={item.url} {...props}>
													<span class="text-xs">{item.title}</span>
												</a>
											{/snippet}
										</Sidebar.MenuSubButton>
									</Sidebar.MenuSubItem>
								{/each}
							</Sidebar.MenuSub>
						</div>
					{/if}
				{/snippet}
			</Collapsible.Content>
		</Sidebar.MenuItem>
	</Collapsible.Root>
</Sidebar.Menu>
