<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Plus } from 'lucide-svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';

	import {
		createEmployeeStatusSchema,
		type CreateEmployeeStatus
	} from '$lib/schemas/employeestatus/schema';

	let { data }: { data: SuperValidated<CreateEmployeeStatus> } = $props();

	let isOpen = $state(false);
	const form = superForm(data, {
		validators: zodClient(createEmployeeStatusSchema),
		multipleSubmits: 'prevent',
		invalidateAll: 'force'
	});

	const { form: formData, enhance, message, delayed } = form;

	$effect(() => {
		if ($message?.status == 'success') {
			showSuccessToast($message.text);
			isOpen = false;
		}

		if ($message?.status == 'error') {
			showErrorToast($message.text);
		}
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>
		<Plus /> Create Employee Status
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Create Employee Status</Dialog.Title>
			<Dialog.Description>
				Employee Status indicates the nature of an individual’s employment relationship with the
				organization, such as permanent, contractual, or temporary.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createeps" method="POST" use:enhance class="space-y-6">
			<Form.Field {form} name="type">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Employee Status</Form.Label>
						<Input {...props} bind:value={$formData.type} />
						<Form.Description
							>Defines the type of employment relationship, like permanent or contractual.</Form.Description
						>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="flex justify-center">
				{#if $delayed}
					<Form.Button disabled><LoaderCircle class="animate-spin" />Processing...</Form.Button>
				{:else}
					<Form.Button>Add</Form.Button>
				{/if}
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
