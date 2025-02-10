<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/utils';
	import { type Icon as IconType } from 'lucide-svelte';
	import { CircleEllipsis } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		childrens: Snippet[];
		icon?: typeof IconType;
		text?: string | null;
		isDrawerOpen: boolean;
		extraClass?: string | null;
	}

	let {
		childrens,
		icon = CircleEllipsis,
		text,
		isDrawerOpen = $bindable(),
		extraClass
	}: Props = $props();
</script>

<DropdownMenu.Root bind:open={isDrawerOpen}>
	<DropdownMenu.Trigger
		class={cn(!text ? 'transition-transform duration-200 hover:rotate-90' : '', extraClass)}
	>
		{#if text}
			{@const Icon = icon}
			<span class="flex items-center gap-1">
				<Icon
					size={16}
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isDrawerOpen && 'rotate-180'
					)}
				/>
				{text}
			</span>
		{:else}
			{@const Icon = icon}
			<Icon />
		{/if}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			{#each childrens as children}
				<DropdownMenu.Item
					onSelect={(e) => {
						e.preventDefault();
					}}
				>
					{@render children()}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
