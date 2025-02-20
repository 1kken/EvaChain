<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import DeleteActionUnit from './delete-action-unit.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { UniversalDeleteInput } from '$lib/schemas/universal_delete_schema';
	import type { UpdateOperationalPlanInput } from '../(data)/operational_plan_schema';
	import UpdateDialogUnit from './update-dialog-unit.svelte';
	import { Download, SquareArrowOutUpRight } from 'lucide-svelte';
	import type { OperationalPlan } from './columns';

	interface Props {
		deleteForm: SuperValidated<UniversalDeleteInput>;
		updateForm: SuperValidated<UpdateOperationalPlanInput>;
		op: OperationalPlan;
	}

	let { deleteForm, updateForm, op }: Props = $props();
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
			<a href={`/dashboard/operational_plan/${op.id}`}>
				<span class="flex items-center gap-3">
					<SquareArrowOutUpRight size={16} /> Open
				</span>
			</a>
		</DropdownMenu.Item>
		{#if op.status === 'draft' || op.status === 'revision'}
			<DropdownMenu.Item
				onSelect={(e) => {
					e.preventDefault();
				}}><UpdateDialogUnit {updateForm} id={op.id} bind:dropDownOpen /></DropdownMenu.Item
			>
		{/if}
		{#if op.status === 'draft'}
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}
				><DeleteActionUnit {deleteForm} id={op.id} bind:dropDownOpen /></DropdownMenu.Item
			>
		{/if}
		<DropdownMenu.Item onselect={handleDownload}>
			<form action={`/api/operational_plan/pdfDownload?id=${op.id}`} method="POST" class="w-full">
				<button type="submit" class="flex w-full items-center gap-3">
					<Download size={16} />
					Download PDF
				</button>
			</form>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
