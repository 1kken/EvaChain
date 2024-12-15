<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Send } from 'lucide-svelte';
	import {
		superForm,
		type FormResult,
		type Infer,
		type SuperValidated
	} from 'sveltekit-superforms';
	import { submitIPCRschema, type SubmitIPCRSchema } from '../../utils/schemas/submit_ipcr_schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { getIPCRStore } from '../../../(data)/state.svelte';
	import type { IPCRFormResult } from '../(data)/types';
	import { Input } from '$lib/components/ui/input';
	import { goto } from '$app/navigation';
	import { showErrorToast } from '$lib/utils/toast';
	interface Props {
		ipcrId: string;
		submitIPCRForm: SuperValidated<Infer<SubmitIPCRSchema>>;
	}

	let { ipcrId, submitIPCRForm }: Props = $props();
	const ipcrStore = getIPCRStore();
	let isOpen = $state(false);

	const form = superForm(submitIPCRForm, {
		validators: zodClient(submitIPCRschema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		async onUpdate({ form, result }) {
			const action = result.data as FormResult<IPCRFormResult>;
			if (form.valid && action.IpcrData && ipcrStore) {
				const ipcrData = action.IpcrData;
				ipcrStore.updateIPCR(ipcrId, ipcrData);
				await goto('/dashboard/ipcr');
			}
		}
	});

	const { form: formData, message, enhance, delayed } = form;
	$formData.ipcrID = ipcrId;

	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast($message.text);
			isOpen = false;
		}
	});
</script>

<AlertDialog.Root bind:open={isOpen}>
	<AlertDialog.Trigger class={`${buttonVariants({ variant: 'default' })} `}>
		<span class="flex items-center gap-2">
			<Send size={16} /> Submit IPCR
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
