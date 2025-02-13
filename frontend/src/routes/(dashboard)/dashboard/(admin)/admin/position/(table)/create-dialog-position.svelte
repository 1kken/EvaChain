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
	import * as Select from '$lib/components/ui/select';
	import { createPositionSchema, type CreatePosition } from '$lib/schemas/position/schema';
	import type { Tables } from '$lib/types/database.types';
	let {
		data,
		natureOfWork
	}: { data: SuperValidated<CreatePosition>; natureOfWork: Tables<'nature_of_work'>[] } = $props();

	let isOpen = $state(false);
	const form = superForm(data, {
		validators: zodClient(createPositionSchema),
		multipleSubmits: 'prevent',
		dataType: 'json'
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
		<Plus /> Create Position
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Create Position</Dialog.Title>
			<Dialog.Description>
				A specific role within the organization, assigned with distinct responsibilities and tasks
				that contribute to achieving institutional goals.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createposition" method="POST" use:enhance class="space-y-6">
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Name</Form.Label>
						<Input {...props} bind:value={$formData.name} />
						<Form.Description>This is the name or title of the position.</Form.Description>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="nature_of_work_id">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Nature of work</Form.Label>
						<Select.Root
							type="single"
							value={$formData.nature_of_work_id?.toString()}
							onValueChange={(value) => {
								$formData.nature_of_work_id = parseInt(value);
							}}
							name={props.name}
						>
							<Select.Trigger {...props} class="truncate">
								{$formData.nature_of_work_id
									? natureOfWork.find((o) => o.id === $formData.nature_of_work_id)?.type
									: 'Select the nature of work that classifies this position'}
							</Select.Trigger>
							<Select.Content>
								{#each natureOfWork as now (now.id)}
									<Select.Item value={now.id.toString()} label={now.type}>
										{now.type}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						<Form.Description>
							Helps to specify the role category, such as teaching, non-teaching,
						</Form.Description>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="flex w-full justify-end">
				{#if $delayed}
					<Form.Button disabled><LoaderCircle class="animate-spin" />Processing...</Form.Button>
				{:else}
					<Form.Button>Submit</Form.Button>
				{/if}
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
