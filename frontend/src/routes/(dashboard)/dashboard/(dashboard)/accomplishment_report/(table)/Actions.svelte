<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import DeleteActionUnit from './Delete.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { UniversalDeleteInput } from '$lib/schemas/universal_delete_schema';
	import UpdateDialogUnit from './Update.svelte';
	import { SquareArrowOutUpRight } from 'lucide-svelte';
	import type { UpdateAccomplishmentReportInput } from '../(data)/accomp_schema';

	interface Props {
		deleteForm: SuperValidated<UniversalDeleteInput>;
		updateForm: SuperValidated<UpdateAccomplishmentReportInput>;
		id: string;
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

		<DropdownMenu.Item
			onSelect={(e) => {
				e.preventDefault();
			}}><UpdateDialogUnit {updateForm} {id} bind:dropDownOpen /></DropdownMenu.Item
		>
		<DropdownMenu.Item onSelect={(e) => e.preventDefault()}
			><DeleteActionUnit {deleteForm} {id} bind:dropDownOpen /></DropdownMenu.Item
		>
		<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
			<a href={`/dashboard/operational_plan/${id}`}>
				<span class="flex items-center gap-3">
					<SquareArrowOutUpRight size={16} /> Open
				</span>
			</a>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
