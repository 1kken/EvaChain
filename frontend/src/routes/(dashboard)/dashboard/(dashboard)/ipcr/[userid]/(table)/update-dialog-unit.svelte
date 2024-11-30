<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { LoaderCircle } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { createUnitSchema, type CreateUnit, type UpdateUnit } from '$lib/schemas/unit/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast, showWarningToast } from '$lib/utils/toast';
	import { unit } from '$lib/states/admin_unit.svelte';
	import { Pencil } from 'lucide-svelte';

	let {
		updateForm,
		id,
		dropDownOpen = $bindable()
	}: {
		updateForm: SuperValidated<UpdateUnit>;
		id: number;
		dropDownOpen?: boolean;
	} = $props();

	let isOpen = $state(false);
	const form = superForm(updateForm, {
		validators: zodClient(createUnitSchema),
		multipleSubmits: 'prevent',
		dataType: 'json'
	});

	const { form: formData, enhance, message, delayed } = form;

	$formData.id = id;
	const curr_unit = unit.units.find((unit) => unit.id === $formData.id);

	//setting default values
	$formData.code = curr_unit?.code;
	$formData.name = curr_unit?.name;

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
			closeAllTabs();
		}
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class=" focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} /> Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-auto">
		<Dialog.Header>
			<Dialog.Title>Update Unit</Dialog.Title>
			<Dialog.Description>
				An operating in DMMMSU is a distinct section that performs specific functions to achieve
				university goals.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateunit" method="POST" use:enhance>
			<Input name="id" class="hidden" bind:value={$formData.id} />
			<Input name="id" class="hidden" bind:value={$formData.name} />
			<Form.Field {form} name="code">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Code</Form.Label>
						<Input {...props} bind:value={$formData.code} />
					{/snippet}
				</Form.Control>
				<Form.Description>This is the acronym/code of the unit.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Name of the unit</Form.Label>
						<Input {...props} bind:value={$formData.name} />
					{/snippet}
				</Form.Control>
				<Form.Description>This is the full name of the unit.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			{#if $delayed}
				<Form.Button disabled><LoaderCircle class="animate-spin" />Processing...</Form.Button>
			{:else}
				<Form.Button>Update</Form.Button>
			{/if}
		</form>
	</Dialog.Content>
</Dialog.Root>
