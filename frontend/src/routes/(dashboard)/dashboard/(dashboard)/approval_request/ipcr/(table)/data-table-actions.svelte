<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { Tables } from '$lib/types/database.types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { RevisionSchemaInput, UuidSchemaInput } from '../(data)/zod_schema';
	import ReviewRawAction from './raw_ipcr/review-raw-action.svelte';

	interface Props {
		uuidForm: SuperValidated<UuidSchemaInput>;
		revisionForm: SuperValidated<RevisionSchemaInput>;
		ipcr_details: Tables<'ipcr_supervisor_details_view'>;
	}

	let { ipcr_details, uuidForm, revisionForm }: Props = $props();
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
		{#if ipcr_details.supervisor_review_status === null}
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<ReviewRawAction {ipcr_details} {uuidForm} bind:dropDownOpen />
			</DropdownMenu.Item>
		{/if}
		<!-- {#if op.status === 'submitted'}
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<ReviewAction formSchema={uuidForm} {op} bind:dropDownOpen />
			</DropdownMenu.Item>
		{/if} -->
		<!-- {#if op.status === 'reviewing'}
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<ApproveAction formSchema={uuidForm} {op} bind:dropDownOpen />
			</DropdownMenu.Item>
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<RevisionAction {revisionForm} {op} bind:dropDownOpen />
			</DropdownMenu.Item>
		{/if} -->
	</DropdownMenu.Content>
</DropdownMenu.Root>
