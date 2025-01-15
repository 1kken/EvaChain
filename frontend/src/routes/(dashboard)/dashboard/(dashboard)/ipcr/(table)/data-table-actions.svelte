<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import DeleteActionUnit from './delete-action-unit.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { DeleteIPCRSchema, UpdateIPCRSchema } from '../(data)/schema';
	import { Download, SquareArrowOutUpRight } from 'lucide-svelte';
	import UpdateIpcr from './UpdateIPCR.svelte';

	interface Props {
		deleteForm: SuperValidated<DeleteIPCRSchema>;
		updateForm: SuperValidated<UpdateIPCRSchema>;
		id: string;
	}

	let { deleteForm, updateForm, id }: Props = $props();
	let dropDownOpen = $state(false);

	function handleDownload(e: { preventDefault: () => void }) {
		// Prevent DropdownMenu from closing
		e.preventDefault();
	}
</script>

<DropdownMenu.Root bind:open={dropDownOpen}>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Open menu</span>
				<Ellipsis class="size-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />

		<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
			<UpdateIpcr {updateForm} {id} bind:dropDownOpen />
		</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
			<a href={`/dashboard/ipcr/${id}`}>
				<span class="flex items-center gap-3">
					<SquareArrowOutUpRight size={16} /> Open
				</span>
			</a>
		</DropdownMenu.Item>
		<DropdownMenu.Item onselect={handleDownload}>
			<form action={`/api/ipcr/pdfDownload?id=${id}`} method="POST" class="w-full">
				<button type="submit" class="flex w-full items-center gap-3">
					<Download size={16} />
					Download PDF
				</button>
			</form>
		</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
			<DeleteActionUnit {deleteForm} {id} bind:dropDownOpen />
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
