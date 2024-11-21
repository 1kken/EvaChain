<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Plus } from 'lucide-svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { createUnitSchema, type CreateUnit } from '$lib/schemas/unit/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';

	let { data }: { data: SuperValidated<Infer<CreateUnit>> } = $props();

	let isOpen = $state(false);
	const form = superForm(data, {
		validators: zodClient(createUnitSchema),
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
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}
		><Plus /> Create Unit</Dialog.Trigger
	>
	<Dialog.Content class="sm:max-w-auto">
		<Dialog.Header>
			<Dialog.Title>Create Unit</Dialog.Title>
			<Dialog.Description>
				An operating in DMMMSU is a distinct section that performs specific functions to achieve
				university goals.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createunit" method="POST" use:enhance>
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
				<Form.Description>This is the acronym/code of the unit.</Form.Description>
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
