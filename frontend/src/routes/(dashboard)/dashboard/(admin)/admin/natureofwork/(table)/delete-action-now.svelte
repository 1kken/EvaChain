<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { showErrorToast, showSuccessToast, showWarningToast } from '$lib/utils/toast';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { LoaderCircle } from 'lucide-svelte';
	import { TriangleAlert } from 'lucide-svelte';
	import { Trash2 } from 'lucide-svelte';

	import {
		deleteNatureOfWorkSchema,
		type DeleteNatureOfWork
	} from '$lib/schemas/natureofwork/schema';
	import { natureOfWork } from '$lib/states/admin_nature_of_work.svelte';

	interface Props {
		deleteForm: SuperValidated<DeleteNatureOfWork>;
		id: number;
		dropDownOpen: boolean;
	}

	let { deleteForm, id, dropDownOpen = $bindable() }: Props = $props();

	const form = superForm(deleteForm, {
		validators: zodClient(deleteNatureOfWorkSchema),
		multipleSubmits: 'prevent',
		dataType: 'json'
	});

	const { form: formData, enhance, message, delayed } = form;

	function closeAllTabs() {
		isOpen = false;
		dropDownOpen = false;
	}

	$effect(() => {
		if ($message?.status == 'success') {
			showSuccessToast($message.text);
			closeAllTabs();
		}

		if ($message?.status == 'error') {
			showErrorToast($message.text);
			closeAllTabs();
		}

		if ($message?.status == 'warning') {
			showWarningToast($message.text);
			isOpen = false;
		}
	});

	$formData.id = id;
	const curr_now = natureOfWork.natureOfWorks.find((n) => n.id === $formData.id);
	$formData.type = curr_now?.type;

	let isOpen = $state(false);
</script>

<AlertDialog.Root bind:open={isOpen}>
	<AlertDialog.Trigger class=" focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Trash2 size={16} />Delete
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
				This action cannot be undone. This will permanently delete {$formData.type}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/deletenow" use:enhance>
			<Input name="id" class="hidden" bind:value={$formData.id} />
			<Input name="name" class="hidden" bind:value={$formData.type} />
			<Form.Field {form} name="confirmation">
				<Form.FieldErrors />
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Please Confirm</Form.Label>
						<Input {...props} bind:value={$formData.confirmation} />
					{/snippet}
				</Form.Control>
				<Form.Description>Please type "delete" to proceed.</Form.Description>
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
