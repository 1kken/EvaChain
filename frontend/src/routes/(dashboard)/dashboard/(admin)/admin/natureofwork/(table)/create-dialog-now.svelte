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
		createNatureOfWorkSchema,
		type CreateNatureOfWork
	} from '$lib/schemas/natureofwork/schema';

	let { data }: { data: SuperValidated<CreateNatureOfWork> } = $props();

	let isOpen = $state(false);
	const form = superForm(data, {
		validators: zodClient(createNatureOfWorkSchema),
		multipleSubmits: 'prevent'
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
		<Plus /> Create Nature of Work
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Create Nature of Work</Dialog.Title>
			<Dialog.Description>
				Nature of Work refers to the general category of an employee's role, such as teaching,
				non-teaching, administrative, or technical, which defines their primary responsibilities
				within the organization.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createnow" method="POST" use:enhance class="space-y-6">
			<Form.Field {form} name="type">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Nature of work</Form.Label>
						<Input {...props} bind:value={$formData.type} />
						<Form.Description
							>Specifies the role category, such as teaching, non-teaching,
						</Form.Description>
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
