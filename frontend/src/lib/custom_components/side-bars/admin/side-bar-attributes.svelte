<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { ChevronRight } from 'lucide-svelte';
	import { SquareUser } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';

	const items = [
		{
			title: 'Employee Status',
			url: '/dashboard/admin/employeestatus'
		},
		{
			title: 'Nature of Work',
			url: '/dashboard/admin/natureofwork'
		},
		{
			title: 'Position',
			url: '/dashboard/admin/position'
		}
	];

	// Function to check if current URL matches item URL
	function isActive(itemUrl: string) {
		return $page.url.pathname === itemUrl;
	}

	// Auto-open the collapsible if one of its items is active
	$effect(() => {
		if (items.some((item) => isActive(item.url))) {
			isOpen = true;
		}
	});

	let isOpen = $state(false);
</script>

<Sidebar.Menu>
	<Collapsible.Root bind:open={isOpen} class="group/collapsible">
		<Sidebar.MenuItem>
			<Collapsible.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						isActive={isOpen || items.some((item) => isActive(item.url))}
						class="flex space-x-8"
					>
						<SquareUser />
						<div class="flex w-full justify-between">
							<span>Attributes</span>
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
													<span>{item.title}</span>
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
