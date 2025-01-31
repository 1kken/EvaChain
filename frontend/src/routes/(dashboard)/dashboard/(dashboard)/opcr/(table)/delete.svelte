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
	import {
		universalDeleteSchema,
		type UniversalDeleteInput
	} from '$lib/schemas/universal_delete_schema';
	import { getOpcrStore } from '../(data)/opcr_state';
	import type { OPCRFormResult } from '../(data)/types';
	interface Props {
		deleteForm: SuperValidated<UniversalDeleteInput>;
		id: string;
		dropDownOpen: boolean;
	}

	let { deleteForm, id, dropDownOpen = $bindable() }: Props = $props();
	const { removeOpcr, currentOpcrs } = getOpcrStore();

	const form = superForm(deleteForm, {
		validators: zodClient(universalDeleteSchema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<OPCRFormResult>;
			if (form.valid && action.opcr) {
				const opcr = action.opcr;
				removeOpcr(opcr.id);
				showWarningToast(`Succesfully deleted OPCR ${opcr.title}`);
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

	const currentOpcr = $currentOpcrs.find((opcr) => opcr.id === id);
	$formData.id = id.toString();
	$formData.expectedText = currentOpcr?.title ?? 'error';

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
				This action cannot be undone. This will permanently delete {$formData.expectedText} and all its
				dependants.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/deleteopcr" use:enhance>
			<Input name="id" class="hidden" bind:value={$formData.id} />
			<Form.Field {form} name="confirmText">
				<Form.FieldErrors />
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Please Confirm</Form.Label>
						<Input {...props} bind:value={$formData.confirmText} />
					{/snippet}
				</Form.Control>
				<Form.Description
					>Please type <span class=" font-bold">{$formData.expectedText} </span> to proceed.</Form.Description
				>
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
