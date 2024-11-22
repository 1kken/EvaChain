<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import DeleteActionUnit from '$lib/custom_components/university_management/delete-action-unit.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { DeleteUnit, UpdateUnit } from '$lib/schemas/unit/schema';
	import UpdateDialogUnit from '$lib/custom_components/university_management/update-dialog-unit.svelte';

	interface Props {
		deleteForm: SuperValidated<DeleteUnit>;
		updateForm: SuperValidated<UpdateUnit>;
		id: number;
	}

	let { deleteForm, updateForm, id }: Props = $props();
</script>

<DropdownMenu.Root>
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
		<DropdownMenu.Item><UpdateDialogUnit {updateForm} {id} /></DropdownMenu.Item>
		<DropdownMenu.Item><DeleteActionUnit {deleteForm} {id} /></DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
