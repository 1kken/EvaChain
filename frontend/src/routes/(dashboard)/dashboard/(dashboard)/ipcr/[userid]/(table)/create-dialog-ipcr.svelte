<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Plus } from 'lucide-svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import {
		type SuperValidated,
		type Infer,
		superForm,
		type FormResult
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { type CreateIPCRSchema, createIPCRSchema } from '../(data)/schema';
	import { getAuthStore } from '$lib/utils/authStore';
	import { checkProfileCompletion } from '$lib/utils/missingDetailsToast';
	import { goto } from '$app/navigation';
	import { getIPCRStore } from '../(data)/state.svelte';
	import type { IPCRFormResult } from '../(data)/types';

	let { data }: { data: SuperValidated<Infer<CreateIPCRSchema>> } = $props();
	let ipcrStore = getIPCRStore();
	let isOpen = $state(false);
	const form = superForm(data, {
		validators: zodClient(createIPCRSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<IPCRFormResult>;
			if (form.valid && action && ipcrStore) {
				const ipcrData = action.ipcr;
				ipcrStore.addIPCR(ipcrData);
				showSuccessToast(`Succesfully added IPCR ${ipcrData.title}`);
				isOpen = false;
			}
		}
	});

	const { form: formData, enhance, message, delayed } = form;

	const { currentProfile, fetchProfile } = getAuthStore();
	$effect(() => {
		if ($message?.status == 'error') {
			showErrorToast($message.text);
		}
	});
	$effect(() => {
		if (isOpen) {
			const errormessage = checkProfileCompletion($currentProfile);
			if (errormessage) {
				showErrorToast(errormessage);
				void goto('/dashboard');
			}
		}
		if ($currentProfile) {
			$formData.owner_id = $currentProfile.id;
			$formData.status = 'draft';
		}
		if ($currentProfile?.office_id) {
			$formData.office_id = $currentProfile.office_id;
		}
		if ($currentProfile?.unit_id) {
			$formData.unit_id = $currentProfile.unit_id;
		}
		if ($currentProfile?.program_id) {
			$formData.program_id = $currentProfile.program_id;
		}
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}
		><Plus /> Create IPCR</Dialog.Trigger
	>
	<Dialog.Content class="sm:max-w-auto">
		<Dialog.Header>
			<Dialog.Title>Create IPCR (Individual Performance Commitment Review)</Dialog.Title>
			<Dialog.Description>
				An operating in DMMMSU is a distinct section that performs specific functions to achieve
				university goals.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createipcr" method="POST" use:enhance>
			<Form.Field {form} name="title">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Title</Form.Label>
						<Input {...props} bind:value={$formData.title} />
					{/snippet}
				</Form.Control>
				<Form.Description>This will be the name of your ipcr.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<input type="hidden" name="owner_id" bind:value={$formData.owner_id} />
			<input type="hidden" name="office_id" bind:value={$formData.office_id} />
			<input type="hidden" name="unit_id" bind:value={$formData.unit_id} />
			<input type="hidden" name="program_id" bind:value={$formData.program_id} />
			<input type="hidden" name="status" bind:value={$formData.status} />
			{#if $delayed}
				<Form.Button disabled><LoaderCircle class="animate-spin" />Processing...</Form.Button>
			{:else}
				<Form.Button>Submit</Form.Button>
			{/if}
		</form>
	</Dialog.Content>
</Dialog.Root>
