<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { SuperValidated } from 'sveltekit-superforms';
	import UpdateDialogProgramme from './update-dialog-position.svelte';
	import type { DeleteProgram, UpdateProgram } from '$lib/schemas/program/schema';
	import DeleteActionProgramme from './delete-action-position.svelte';
	import type { Tables } from '$lib/types/database.types';
	import type { Position } from './column';

	interface Props {
		deleteForm: SuperValidated<DeleteProgram>;
		updateForm: SuperValidated<UpdateProgram>;
		position: Position;
		natureOfWorks: Tables<'nature_of_work'>[];
	}

	let { deleteForm, updateForm, position, natureOfWorks }: Props = $props();

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
			><UpdateDialogProgramme {updateForm} {position} {natureOfWorks} bind:dropDownOpen />
		</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
			<DeleteActionProgramme {deleteForm} {position} bind:dropDownOpen />
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
