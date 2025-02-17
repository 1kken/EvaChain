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
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { goto } from '$app/navigation';
	import { showErrorToast } from '$lib/utils/toast';
	import { submitOPschema, type SubmitOPSchema } from '../../(data)/operational_plan_schema';
	import { getOperationalPlanStore } from '../states/current_operational_plan_state';
	import type { OPFormResult } from '../../(data)/types';
	import { getOperationalPlansStore } from '../../(data)/operational_plan_state.svelte';

	interface Props {
		submitIPCRForm: SuperValidated<Infer<SubmitOPSchema>>;
	}

	let { submitIPCRForm }: Props = $props();
	//you might get confused at this but this is different only i know becasue i code this damn project
	//this is the current ipcr present to the user //single
	const { currentOperationalPlan, updateOperationalPlan } = getOperationalPlanStore();
	//this is the all of the operational plan present to the user //multiple
	const { updateOperationalPlan: single } = getOperationalPlansStore();
	let isOpen = $state(false);

	//check if current ipcr is not null

	const form = superForm(submitIPCRForm, {
		validators: zodClient(submitOPschema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		async onUpdate({ form, result }) {
			const action = result.data as FormResult<OPFormResult>;
			if (form.valid && action.opData) {
				const opData = action.opData;
				updateOperationalPlan(opData);
				single(opData.id, opData);
				await goto('/dashboard/operational_plan/');
			}
		}
	});

	const { form: formData, message, enhance, delayed, reset } = form;
	if ($currentOperationalPlan) {
		$formData.operationalPlanID = $currentOperationalPlan.id;
	}

	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast($message.text);
			if ($currentOperationalPlan) {
				reset({
					data: {
						operationalPlanID: $currentOperationalPlan.id
					},
					newState: { operationalPlanID: $currentOperationalPlan.id }
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
				After submitting the Operational Plan, you will no longer be able to edit or delete the
				indicators. Please review everything thoroughly before submission.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/submitop" id="submit-ipcr" use:enhance>
			<Form.Field {form} name="operationalPlanID">
				<Form.Control>
					{#snippet children({ props })}
						<Input type="hidden" {...props} bind:value={$formData.operationalPlanID} />
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
