<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { showErrorToast, showWarningToast } from '$lib/utils/toast';
	import { superForm, type FormResult, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { LoaderCircle } from 'lucide-svelte';
	import { TriangleAlert } from 'lucide-svelte';
	import { Trash2 } from 'lucide-svelte';
	import { universalDeleteSchema } from '$lib/schemas/universal_delete_schema';
	import type { IPCRAccomplishmentFormResult } from '../../../../utils/types';
	import { getIpcrAccomplishmentFormContext } from '../../../../states/ipcr_indicator_accomplishment_form_state';
	import { getIpcrAccomplishmentStore } from '../../../../states/ipcr_indicator_accomplishment_state';
	import type { Tables } from '$lib/types/database.types';

	interface Props {
		accomplishment: Tables<'ipcr_indicator_accomplishment'>; // Updated table name
	}

	let { accomplishment }: Props = $props();
	const { deleteForm } = getIpcrAccomplishmentFormContext();
	const { removeAccomplishment } = getIpcrAccomplishmentStore();

	let isOpen = $state(false);
	const form = superForm(deleteForm, {
		id: crypto.randomUUID(),
		validators: zodClient(universalDeleteSchema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<IPCRAccomplishmentFormResult>;
			if (form.valid && action.ipcrAccomplishment) {
				const accomplishment = action.ipcrAccomplishment;
				removeAccomplishment(accomplishment.id);
				showWarningToast(`Succesfully deleted IPCR Accomplishment`);
				isOpen = false;
			}
		}
	});
	const { form: formData, enhance, message, delayed } = form;

	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast($message?.text);
			isOpen = false;
		}
	});
	$formData.id = accomplishment.id;
	$formData.confirmText = 'delete';
</script>

<AlertDialog.Root bind:open={isOpen}>
	<AlertDialog.Trigger class=" focus-visible:outline-none">
		<Trash2 size={16} />
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title
				><span class="flex items-center gap-4"
					><TriangleAlert class="text-red-600" /> Are you absolutely sure?</span
				></AlertDialog.Title
			>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently deletethis accomplishment and all its
				dependants.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/deleteaccomplishment" use:enhance>
			<Input name="id" class="hidden" bind:value={$formData.id} />
			<Form.Field {form} name="expectedText">
				<Form.FieldErrors />
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Please Confirm</Form.Label>
						<Input {...props} bind:value={$formData.expectedText} />
					{/snippet}
				</Form.Control>
				<Form.Description
					>Please type <span class=" font-bold">delete</span> to proceed.
				</Form.Description>
			</Form.Field>
			{#if $delayed}
				<div class="flex justify-between">
					<AlertDialog.Cancel disabled class="text-gray-500" type="button"
						>Cancel</AlertDialog.Cancel
					>
					<Form.Button disabled class="bg-red-300 text-white">
						<LoaderCircle class="animate-spin" />Deleting...
					</Form.Button>
				</div>
			{:else}
				<div class="flex justify-between">
					<AlertDialog.Cancel type="button" class="text-gray-600 hover:text-gray-800">
						Cancel
					</AlertDialog.Cancel>
					<AlertDialog.Action
						type="submit"
						class="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
					>
						<Trash2 />Delete
					</AlertDialog.Action>
				</div>
			{/if}
		</form>
		<AlertDialog.Footer></AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
