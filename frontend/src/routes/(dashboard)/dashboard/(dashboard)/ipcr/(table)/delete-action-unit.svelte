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
	import { deleteIPCRSchema, type DeleteIPCRSchema } from '../(data)/schema';
	import { getIPCRStore } from '../(data)/state.svelte';
	import { getAuthStore } from '$lib/utils/authStore';
	import { goto, invalidateAll } from '$app/navigation';
	import type { IPCRFormResult } from '../(data)/types';
	interface Props {
		deleteForm: SuperValidated<DeleteIPCRSchema>;
		id: string;
		dropDownOpen: boolean;
	}

	let { deleteForm, id, dropDownOpen = $bindable() }: Props = $props();
	const { currentUserIPCR, removeIPCR } = getIPCRStore();
	const { currentProfile } = getAuthStore();

	const form = superForm(deleteForm, {
		validators: zodClient(deleteIPCRSchema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<IPCRFormResult>;
			if (form.valid && action) {
				const ipcrData = action.deletedIPCR;
				removeIPCR(ipcrData.id);
				showWarningToast(`Succesfully deleted IPCR ${ipcrData.title}`);
				closeAllTabs();
			}
		}
	});
	const { form: formData, enhance, message, delayed } = form;
	const title = $currentUserIPCR.find((ip) => ip.id === id)?.title;

	function closeAllTabs() {
		isOpen = false;
		dropDownOpen = false;
	}

	$effect(() => {
		if ($message?.status == 'error') {
			showErrorToast($message.text);
			closeAllTabs();
		}
	});

	let isOpen = $state(false);
	if (!$currentProfile) {
		goto('/dashboard');
		invalidateAll();
	}

	if (title) {
		$formData.expectedTitle = title;
	}
	if ($currentProfile?.id) {
		$formData.owner_id = $currentProfile?.id;
	}
	$formData.id = id;
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
				This action cannot be undone. This will permanently delete {title} and all its dependants.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/deleteipcr" use:enhance>
			<input hidden value={$formData.owner_id} name="owner_id" />
			<Input name="id" class="hidden" bind:value={$formData.id} />
			<Form.Field {form} name="confirmTitle">
				<Form.FieldErrors />
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Please Confirm</Form.Label>
						<Input {...props} bind:value={$formData.confirmTitle} />
					{/snippet}
				</Form.Control>
				<Form.Description
					>Please type <span class=" font-bold">{title}</span> to proceed.
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
