<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Download, SquareArrowOutUpRight } from 'lucide-svelte';
	import type { Tables } from '$lib/types/database.types';
	import ReviewAction from './review-action.svelte';
	import RevisionAction from './revision-action.svelte';
	import ApproveAction from './approve-action.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { RevisionSchemaInput, UuidSchemaInput } from '../(data)/zod_schema';

	interface Props {
		uuidForm: SuperValidated<UuidSchemaInput>;
		revisionForm: SuperValidated<RevisionSchemaInput>;
		op: Tables<'operational_plan'>;
	}

	let { op, uuidForm, revisionForm }: Props = $props();
	let dropDownOpen = $state(false);

	const viewPdf = async (id: string) => {
		try {
			const response = await fetch(`/api/operational_plan/pdfDownload?id=${id}&inline=true`, {
				method: 'POST'
			});
			if (!response.ok) throw new Error('Failed to generate PDF');

			// Create blob URL and open in new tab
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			window.open(url, '_blank');

			// Clean up blob URL after opening
			setTimeout(() => URL.revokeObjectURL(url), 100);
		} catch (error) {
			console.error('Error viewing PDF:', error);
			// Handle error appropriately
		}
	};
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
			<button
				class="flex w-full gap-2 hover:underline"
				onclick={() => {
					viewPdf(op.id);
				}}
				onkeydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						viewPdf(op.id);
					}
				}}
				aria-label={`View PDF for operational plan`}
				><SquareArrowOutUpRight size={16} /> Open</button
			>
		</DropdownMenu.Item>
		{#if op.status === 'submitted'}
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<ReviewAction formSchema={uuidForm} {op} bind:dropDownOpen />
			</DropdownMenu.Item>
		{/if}
		{#if op.status === 'reviewing'}
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<ApproveAction formSchema={uuidForm} {op} bind:dropDownOpen />
			</DropdownMenu.Item>
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<RevisionAction {revisionForm} {op} bind:dropDownOpen />
			</DropdownMenu.Item>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
