<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Send } from 'lucide-svelte';
	import {
		superForm,
		type FormResult,
		type Infer,
		type SuperValidated
	} from 'sveltekit-superforms';
	import { submitIPCRschema, type SubmitIPCRSchema } from '../schema/ipcr_submit_schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { goto } from '$app/navigation';
	import { showErrorToast } from '$lib/utils/toast';
	import { getIpcrStore } from '../states/current_ipcr_state';
	import type { IPCRFormResult } from '../utils/types';
	import { getIPCRStore } from '../../(data)/state.svelte';

	interface Props {
		submitIPCRForm: SuperValidated<Infer<SubmitIPCRSchema>>;
	}

	let { submitIPCRForm }: Props = $props();
	//you might get confused at this but this is different only i know becasue i code this damn project
	//this is the current ipcr present to the user //single
	const { currentIpcr, updateIpcr } = getIpcrStore();
	//this is the akll of the ipcr present to the user //multiple
	const { updateIPCR } = getIPCRStore();
	let isOpen = $state(false);

	//check if current ipcr is not null

	const form = superForm(submitIPCRForm, {
		validators: zodClient(submitIPCRschema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		async onUpdate({ form, result }) {
			const action = result.data as FormResult<IPCRFormResult>;
			if (form.valid && action.IpcrData) {
				console.log('here');
				const ipcrData = action.IpcrData;
				updateIpcr(ipcrData);
				updateIPCR(ipcrData.id, ipcrData);
				await goto('/dashboard/ipcr');
			}
		}
	});

	const { form: formData, message, enhance, delayed, reset } = form;
	if ($currentIpcr) {
		$formData.ipcrID = $currentIpcr.id;
	}

	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast($message.text);
			if ($currentIpcr) {
				reset({
					data: {
						ipcrID: $currentIpcr.id
					},
					newState: { ipcrID: $currentIpcr.id }
				});
			}
			isOpen = false;
		}
	});
</script>

<AlertDialog.Root bind:open={isOpen}>
	<AlertDialog.Trigger class="focus-visible:outline-none" id="nav-3">
		<span class="flex items-center gap-2">
			<Send class="h-5 w-5" />
			<span class="hidden md:inline">Submit IPCR</span>
		</span>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				After submitting your IPCR, you will no longer be able to edit or delete the indicators.
				Please review everything thoroughly before submission.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/submitipcr" id="submit-ipcr" use:enhance>
			<Form.Field {form} name="ipcrID">
				<Form.Control>
					{#snippet children({ props })}
						<Input type="hidden" {...props} bind:value={$formData.ipcrID} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</form>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action type="submit" form="submit-ipcr">Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
