<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Pencil } from 'lucide-svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { employeeStatus } from '$lib/states/admin_employee_status.svelte';
	import {
		updateEmployeeStatusSchema,
		type UpdateEmployeeStatus
	} from '$lib/schemas/employeestatus/schema';

	interface Props {
		updateForm: SuperValidated<UpdateEmployeeStatus>;
		id: number;
		dropDownOpen: boolean;
	}

	let { updateForm, id, dropDownOpen = $bindable() }: Props = $props();

	const form = superForm(updateForm, {
		validators: zodClient(updateEmployeeStatusSchema),
		multipleSubmits: 'prevent',
		dataType: 'json'
	});

	let isOpen = $state(false);
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
	});

	$formData.id = id;
	const curr_eps = employeeStatus.employeeStatuses.find((e) => e.id === $formData.id);
	$formData.type = curr_eps?.type;
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class=" focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} /> Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Update Employee Status</Dialog.Title>
			<Dialog.Description>
				Employee Status indicates the nature of an individual’s employment relationship with the
				organization, such as permanent, contractual, or temporary.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateeps" method="POST" use:enhance class="space-y-6">
			<Form.Field {form} name="type">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Code</Form.Label>
						<Input {...props} bind:value={$formData.type} />
						<Form.Description
							>Defines the type of employment relationship, like permanent or contractual.</Form.Description
						>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			{#if $delayed}
				<Form.Button disabled><LoaderCircle class="animate-spin" />Processing...</Form.Button>
			{:else}
				<Form.Button>Submit</Form.Button>
			{/if}
		</form>
	</Dialog.Content>
</Dialog.Root>
