<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { DeleteOffice, UpdateOffice } from '$lib/schemas/office/schema';
	import DeleteActionOffice from './delete-action-office.svelte';
	import UpdateDialogOffice from './update-dialog-office.svelte';

	interface Props {
		deleteForm: SuperValidated<DeleteOffice>;
		updateForm: SuperValidated<UpdateOffice>;
		id: number;
	}

	let { deleteForm, updateForm, id }: Props = $props();

	let dropDownOpen = $state(false);
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
		<DropdownMenu.Item onSelect={(e) => e.preventDefault()}
			><UpdateDialogOffice {id} {updateForm} bind:dropDownOpen /></DropdownMenu.Item
		>
		<DropdownMenu.Item onSelect={(e) => e.preventDefault()}
			><DeleteActionOffice {deleteForm} {id} bind:dropDownOpen /></DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
