<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { CircleEllipsis } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		deleteAction: Snippet;
		updateDialog: Snippet;
		isDrawerOpen: boolean;
	}

	let { deleteAction, updateDialog, isDrawerOpen = $bindable() }: Props = $props();
</script>

<DropdownMenu.Root bind:open={isDrawerOpen}>
	<DropdownMenu.Trigger class="hover:rotate-90"><CircleEllipsis /></DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			<DropdownMenu.Item
				onSelect={(e) => {
					e.preventDefault();
				}}
			>
				{@render deleteAction()}
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onSelect={(e) => {
					e.preventDefault();
				}}
			>
				{@render updateDialog()}
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
