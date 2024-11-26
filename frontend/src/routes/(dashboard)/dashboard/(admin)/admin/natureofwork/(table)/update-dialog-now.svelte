<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Pencil } from 'lucide-svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import {
		updateNatureOfWorkSchema,
		type UpdateNatureOfWork
	} from '$lib/schemas/natureofwork/schema';
	import { natureOfWork } from '$lib/states/admin_nature_of_work.svelte';

	interface Props {
		updateForm: SuperValidated<UpdateNatureOfWork>;
		id: number;
		dropDownOpen: boolean;
	}

	let { updateForm, id, dropDownOpen = $bindable() }: Props = $props();

	const form = superForm(updateForm, {
		validators: zodClient(updateNatureOfWorkSchema),
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
	const curr_now = natureOfWork.natureOfWorks.find((n) => n.id === $formData.id);
	$formData.type = curr_now?.type;
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class=" focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} /> Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Update Nature of Work</Dialog.Title>
			<Dialog.Description>
				Nature of Work refers to the general category of an employee's role, such as teaching,
				non-teaching, administrative, or technical, which defines their primary responsibilities
				within the organization.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updatenow" method="POST" use:enhance class="space-y-6">
			<Form.Field {form} name="type">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Code</Form.Label>
						<Input {...props} bind:value={$formData.type} />
						<Form.Description>
							Specifies the role category, such as teaching, non-teaching,
						</Form.Description>
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
