<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { SuperValidated } from 'sveltekit-superforms';
	import UpdateDialogProgramme from './update-dialog-program.svelte';
	import type { DeleteProgram, UpdateProgram } from '$lib/schemas/program/schema';
	import DeleteActionProgramme from './delete-action-program.svelte';
	import type { Programme } from './column';
	import type { Tables } from '$lib/types/database.types';
	import type { Office } from '../../office/(table)/column';

	interface Props {
		deleteForm: SuperValidated<DeleteProgram>;
		updateForm: SuperValidated<UpdateProgram>;
		program: Programme;
		units: Tables<'unit'>[];
		offices: Office[];
	}

	let { deleteForm, updateForm, program, units, offices }: Props = $props();

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
			><UpdateDialogProgramme {updateForm} {program} {units} {offices} bind:dropDownOpen />
		</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
			<DeleteActionProgramme {deleteForm} {program} bind:dropDownOpen />
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
