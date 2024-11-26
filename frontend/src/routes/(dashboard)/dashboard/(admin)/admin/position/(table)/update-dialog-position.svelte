<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { LoaderCircle } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import * as Select from '$lib/components/ui/select';
	import { Pencil } from 'lucide-svelte';
	import { updatePositionSchema, type UpdatePosition } from '$lib/schemas/position/schema';
	import { position } from '$lib/states/admin_positions_state.svelte';
	import { natureOfWork } from '$lib/states/admin_nature_of_work.svelte';

	interface Props {
		updateForm: SuperValidated<UpdatePosition>;
		id: number;
		dropDownOpen: boolean;
	}
	let { updateForm, id, dropDownOpen = $bindable() }: Props = $props();

	let isOpen = $state(false);
	const form = superForm(updateForm, {
		validators: zodClient(updatePositionSchema),
		multipleSubmits: 'prevent',
		dataType: 'json'
	});

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
	const curr_position = position.positions.find((p) => p.id === $formData.id);
	const curr_under_nature_of_work = natureOfWork.natureOfWorks;

	$formData.name = curr_position?.name ?? 'Error';
	$formData.nature_of_work_id = curr_position?.nature_of_work?.id;
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class=" focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} /> Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Update Position</Dialog.Title>
			<Dialog.Description>
				A specific role within the organization, assigned with distinct responsibilities and tasks
				that contribute to achieving institutional goals.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateposition" method="POST" use:enhance class="space-y-6">
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
									? curr_under_nature_of_work.find((o) => o.id === $formData.nature_of_work_id)
											?.type
									: 'Select the nature of work that classifies this position'}
							</Select.Trigger>
							<Select.Content>
								{#each curr_under_nature_of_work as now (now.id)}
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
