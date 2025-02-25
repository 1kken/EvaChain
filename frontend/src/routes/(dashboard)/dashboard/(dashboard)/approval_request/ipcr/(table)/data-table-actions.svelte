<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { Tables } from '$lib/types/database.types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { RevisionSchemaInput, UuidSchemaInput } from '../(data)/zod_schema';
	import ReviewRawAction from './raw_ipcr/review-raw-action.svelte';
	import ReviewedRawAction from './raw_ipcr/reviewed-raw-action.svelte';
	import RevisionRawAction from './raw_ipcr/revision-raw-action.svelte';
	import ReviewNonRaw from './non_raw_ipcr/review-non-raw.svelte';
	import RevisionNonRaw from './non_raw_ipcr/revision-non-raw.svelte';
	import ApproveAction from './non_raw_ipcr/approve-action.svelte';

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
		<!--RULES IPCR STATUS before SUPERVISOR STATUS-->

		<!--Initial State-->
		{#if ipcr_details.supervisor_review_status === null}
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<ReviewRawAction {ipcr_details} {uuidForm} bind:dropDownOpen />
			</DropdownMenu.Item>
		{/if}
		<!-- If ipcr is submitted  and supervisor status review is revision raw-->
		{#if ipcr_details.ipcr_status === 'submitted_raw' && ipcr_details.supervisor_review_status === 'revision_raw'}
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<ReviewRawAction {ipcr_details} {uuidForm} bind:dropDownOpen />
			</DropdownMenu.Item>
		{/if}

		<!-- If ipcr is submitted  and supervisor status review is reviewed raw-->
		{#if ipcr_details.ipcr_status === 'revision_raw' && ipcr_details.supervisor_review_status === 'under_review_raw'}
			<DropdownMenu.Item disabled onSelect={(e) => e.preventDefault()}>
				<h1>Awaiting supervisor review.</h1>
			</DropdownMenu.Item>
		{/if}

		<!-- If ipcr is submitted  and supervisor status review is reviewed raw-->
		{#if ipcr_details.ipcr_status === 'submitted_raw' && ipcr_details.supervisor_review_status === 'reviewed_raw'}
			<DropdownMenu.Item disabled onSelect={(e) => e.preventDefault()}>
				<h1>Awaiting supervisor review.</h1>
			</DropdownMenu.Item>
		{/if}

		<!--If ipcr is under revision raw and supervisor status review is under revision -->
		{#if ipcr_details.ipcr_status === 'revision_raw' && ipcr_details.supervisor_review_status === 'revision_raw'}
			<DropdownMenu.Item disabled onSelect={(e) => e.preventDefault()}>
				<h1>Awaiting for revision.</h1>
			</DropdownMenu.Item>
		{/if}

		<!-- If ipcr is under reviosion raw and supervisor status review is reviwed raw-->
		{#if ipcr_details.ipcr_status === 'revision_raw' && ipcr_details.supervisor_review_status === 'reviewed_raw'}
			<DropdownMenu.Item disabled onSelect={(e) => e.preventDefault()}>
				<h1>Awaiting supervisor revision.</h1>
			</DropdownMenu.Item>
		{/if}

		<!-- If ipcr is under_review_raw  and supervisor status review is reviewed raw-->
		{#if ipcr_details.ipcr_status === 'under_review_raw' && ipcr_details.supervisor_review_status === 'reviewed_raw'}
			<DropdownMenu.Item disabled onSelect={(e) => e.preventDefault()}>
				<h1>Awaiting supervisor review.</h1>
			</DropdownMenu.Item>
		{/if}

		{#if ipcr_details.ipcr_status === 'under_review_raw' && ipcr_details.supervisor_review_status === 'under_review_raw'}
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<ReviewedRawAction {ipcr_details} {uuidForm} bind:dropDownOpen />
			</DropdownMenu.Item>
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<RevisionRawAction {ipcr_details} {revisionForm} bind:dropDownOpen />
			</DropdownMenu.Item>
		{/if}

		{#if ipcr_details.ipcr_status === 'reviewed_raw' && ipcr_details.supervisor_review_status === 'reviewed_raw'}
			<DropdownMenu.Item disabled onSelect={(e) => e.preventDefault()}>
				<h1>Awaiting submission of Accomplishments.</h1>
			</DropdownMenu.Item>
		{/if}
		<!--==================================THIS SECTION IS NON RAW===================================================-->
		{#if ipcr_details.ipcr_status === 'submitted' && ipcr_details.supervisor_review_status === 'reviewed_raw'}
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<ReviewNonRaw {ipcr_details} {uuidForm} bind:dropDownOpen />
			</DropdownMenu.Item>
		{/if}

		{#if ipcr_details.ipcr_status === 'under_review' && ipcr_details.supervisor_review_status === 'reviewed_raw'}
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<ReviewNonRaw {ipcr_details} {uuidForm} bind:dropDownOpen />
			</DropdownMenu.Item>
		{/if}

		{#if ipcr_details.ipcr_status === 'revision' && ipcr_details.supervisor_review_status === 'revision'}
			<DropdownMenu.Item disabled onSelect={(e) => e.preventDefault()}>
				<h1>Awaiting for revision.</h1>
			</DropdownMenu.Item>
		{/if}

		{#if ipcr_details.ipcr_status === 'revision' && ipcr_details.supervisor_review_status === 'reviewed_raw'}
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<ReviewNonRaw {ipcr_details} {uuidForm} bind:dropDownOpen />
			</DropdownMenu.Item>
		{/if}

		{#if ipcr_details.ipcr_status === 'revision' && ipcr_details.supervisor_review_status === 'under_review'}
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<ApproveAction {ipcr_details} {uuidForm} bind:dropDownOpen />
			</DropdownMenu.Item>
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<RevisionNonRaw {ipcr_details} {revisionForm} bind:dropDownOpen />
			</DropdownMenu.Item>
		{/if}

		{#if ipcr_details.ipcr_status === 'submitted' && ipcr_details.supervisor_review_status === 'revision'}
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<ApproveAction {ipcr_details} {uuidForm} bind:dropDownOpen />
			</DropdownMenu.Item>
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<RevisionNonRaw {ipcr_details} {revisionForm} bind:dropDownOpen />
			</DropdownMenu.Item>
		{/if}

		{#if ipcr_details.ipcr_status === 'under_review' && ipcr_details.supervisor_review_status === 'under_review'}
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<ApproveAction {ipcr_details} {uuidForm} bind:dropDownOpen />
			</DropdownMenu.Item>
			<DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
				<RevisionNonRaw {ipcr_details} {revisionForm} bind:dropDownOpen />
			</DropdownMenu.Item>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
