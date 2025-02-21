<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { showErrorToast, showSuccessToast, showWarningToast } from '$lib/utils/toast';
	import { superForm, type FormResult, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { CircleFadingArrowUp, LoaderCircle, RotateCw } from 'lucide-svelte';
	import { TriangleAlert } from 'lucide-svelte';
	import type { OPFormResult } from '../(data)/types';
	import type { Tables } from '$lib/types/database.types';
	import { revisionSchema, uuidSchema, type RevisionSchemaInput } from '../(data)/zod_schema';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';

	interface Props {
		op: Tables<'operational_plan'>;
		revisionForm: SuperValidated<RevisionSchemaInput>;
		dropDownOpen: boolean;
	}

	let { dropDownOpen = $bindable(), op, revisionForm }: Props = $props();
	const form = superForm(revisionForm, {
		validators: zodClient(revisionSchema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		invalidateAll: true,
		onUpdate({ form, result }) {
			const action = result.data as FormResult<OPFormResult>;
			if (form.valid && action.opData) {
				const opData = action.opData;
				showSuccessToast('Operational Plan status set to For Revision');
				closeAllTabs();
			}
		}
	});

	const { form: formData, enhance, message, delayed } = form;

	function closeAllTabs() {
		isOpen = false;
		dropDownOpen = false;
	}

	$effect(() => {
		if ($message?.status == 'error') {
			showErrorToast($message.text);
			closeAllTabs();
		}

		if ($message?.status == 'warning') {
			showWarningToast($message.text);
			closeAllTabs();
		}
	});

	$formData.id = op.id;
	$formData.op_creator_id = op.creator_id;
	let isOpen = $state(false);
</script>

<AlertDialog.Root bind:open={isOpen}>
	<AlertDialog.Trigger class=" focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<RotateCw size="16" /> Set Status as For Revision
		</span>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title
				><span class="flex items-center gap-4"
					><TriangleAlert class="text-red-600" /> Are you absolutely sure?</span
				></AlertDialog.Title
			>
			<AlertDialog.Description>
				This will set the status of the Operational Plan as <span class="font-bold"
					>For Revision.</span
				>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/setstatusrevision" use:enhance>
			<Input name="id" class="hidden" bind:value={$formData.id} />
			<Input name="op_creator_id" class="hidden" bind:value={$formData.op_creator_id} />
			<Form.Field {form} name="message">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Message</Form.Label>
						<IntelligentInput
							textAreaWidth={'full'}
							placeholder="Enter a message discussing why the operational plan is being set for revision..."
							bind:content={$formData.message}
							name={props.name}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			{#if $delayed}
				<div class="flex justify-between">
					<AlertDialog.Cancel disabled class="text-gray-500" type="button"
						>Cancel</AlertDialog.Cancel
					>
					<Form.Button disabled class="bg-red-300 text-white">
						<LoaderCircle class="animate-spin" />Updating...
					</Form.Button>
				</div>
			{:else}
				<div class="flex justify-between">
					<AlertDialog.Cancel type="button" class="text-gray-600 hover:text-gray-800">
						Cancel
					</AlertDialog.Cancel>
					<AlertDialog.Action
						type="submit"
						class="bg-green-700 text-white hover:bg-green-600 focus:ring-green-500"
					>
						<CircleFadingArrowUp /> Update
					</AlertDialog.Action>
				</div>
			{/if}
		</form>
		<AlertDialog.Footer></AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
