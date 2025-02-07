<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Pencil, Plus, Save } from 'lucide-svelte';
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
	import { getAuthStore } from '$lib/utils/authStore';
	import { checkProfileCompletion } from '$lib/utils/missingDetailsToast';
	import IncompleteProfileDialog from './incomplete-profile-dialog.svelte';
	import { getIPCRStore } from '../(data)/state.svelte';
	import type { IPCRFormResult } from '../(data)/types';
	import { updateIPCRSchema, type UpdateIPCRSchema } from '../(data)/schema';

	interface Props {
		updateForm: SuperValidated<UpdateIPCRSchema>;
		id: string;
		dropDownOpen: boolean;
	}

	let { updateForm, id, dropDownOpen = $bindable() }: Props = $props();

	const { updateIPCR, currentUserIPCR } = getIPCRStore();
	const { currentProfile } = getAuthStore();

	let isOpen = $state(false);
	const form = superForm(updateForm, {
		validators: zodClient(updateIPCRSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<IPCRFormResult>;
			if (form.valid && action.ipcrData) {
				const ipcrData = action.ipcrData;
				updateIPCR(ipcrData.id, ipcrData);
				showSuccessToast(`Succesfully updated IPCR ${ipcrData.title}`);
				isOpen = false;
				dropDownOpen = false;
				reset({
					newState: {
						...ipcrData,
						head_of_operating_unit: ipcrData.head_of_operating_unit ?? undefined,
						immediate_supervisor: ipcrData.immediate_supervisor ?? undefined,
						immediate_supervisor_position: ipcrData.immediate_supervisor_position ?? undefined,
						program_chair: ipcrData.program_chair ?? undefined,
						dean: ipcrData.dean ?? undefined
					},
					data: {
						...ipcrData,
						head_of_operating_unit: ipcrData.head_of_operating_unit ?? undefined,
						immediate_supervisor: ipcrData.immediate_supervisor ?? undefined,
						immediate_supervisor_position: ipcrData.immediate_supervisor_position ?? undefined,
						program_chair: ipcrData.program_chair ?? undefined,
						dean: ipcrData.dean ?? undefined
					}
				});
			}
		}
	});

	const { form: formData, enhance, message, delayed, reset } = form;

	//set data
	const currentIPCR = $currentUserIPCR.find((ip) => ip.id === id);
	$formData.dean = currentIPCR?.dean || undefined;
	$formData.program_chair = currentIPCR?.program_chair || undefined;
	$formData.immediate_supervisor = currentIPCR?.immediate_supervisor || undefined;
	$formData.head_of_operating_unit = currentIPCR?.head_of_operating_unit ?? 'Error';
	$formData.immediate_supervisor_position = currentIPCR?.immediate_supervisor_position || undefined;
	$formData.id = id;

	let completeProfile = $state(true);
	let errorMessage = $state<string | null>();
	$effect(() => {
		if ($currentProfile === null) return;
		const errormessage = checkProfileCompletion($currentProfile);
		if (errormessage) {
			completeProfile = false;
			errorMessage = errormessage;
		} else {
			completeProfile = true;
			errorMessage = null;
		}

		if ($message?.status == 'error') {
			showErrorToast($message.text);
		}
	});
</script>

{#if !completeProfile}
	<IncompleteProfileDialog errors={errorMessage} />
{:else}
	<Dialog.Root bind:open={isOpen}>
		<Dialog.Trigger class=" focus-visible:outline-none">
			<span class="flex items-center gap-3">
				<Pencil size={16} /> Edit
			</span>
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-auto">
			<Dialog.Header>
				<Dialog.Title>Individual Performance Commitment Review</Dialog.Title>
				<Dialog.Description>
					An Individual Performance Commitment and Review (IPCR) is a tool used to document, assess,
					and align an individual’s tasks, objectives, and performance with the organizational
					goals.
				</Dialog.Description>
			</Dialog.Header>
			<form action="?/updateipcr" method="POST" use:enhance>
				<input type="hidden" name="id" bind:value={$formData.id} />
				<Form.Field {form} name="head_of_operating_unit">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Head of Operating Unit</Form.Label>
							<Input
								{...props}
								bind:value={$formData.head_of_operating_unit}
								placeholder="Juan D. Cruz"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<!--Teaching-->
				{#if $currentProfile!.nature_of_work_id === 1}
					<div class="grid grid-cols-1 space-x-2 md:grid-cols-2">
						<Form.Field {form} name="dean">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Dean Name</Form.Label>
									<Input {...props} bind:value={$formData.dean} placeholder="Juan D. Cruz" />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Form.Field {form} name="program_chair">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Program Chair</Form.Label>
									<Input
										{...props}
										bind:value={$formData.program_chair}
										placeholder="Juan D. Cruz"
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				{:else}
					<div class="grid grid-cols-1 space-x-2 md:grid-cols-2">
						<Form.Field {form} name="immediate_supervisor">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Immediate Supervisor</Form.Label>
									<Input
										{...props}
										bind:value={$formData.immediate_supervisor}
										placeholder="Juan D. Cruz"
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Form.Field {form} name="immediate_supervisor_position">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Immediate Supervisor's Position</Form.Label>
									<Input
										{...props}
										bind:value={$formData.immediate_supervisor_position}
										placeholder="Head of instruction office, etc."
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				{/if}
				{#if $delayed}
					<Form.Button disabled class="w-full"
						><LoaderCircle class="animate-spin" />Processing...</Form.Button
					>
				{:else}
					<Form.Button class="w-full"><Save /> Save</Form.Button>
				{/if}
			</form>
		</Dialog.Content>
	</Dialog.Root>
{/if}
