<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Pencil } from 'lucide-svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { updateOfficeSchema, type UpdateOffice } from '$lib/schemas/office/schema';
	import * as Select from '$lib/components/ui/select';
	import { unit } from '$lib/states/admin_unit.svelte';
	import { office } from '$lib/states/admin_office.svelte';

	interface Props {
		updateForm: SuperValidated<UpdateOffice>;
		id: number;
	}

	let { updateForm, id }: Props = $props();

	const form = superForm(updateForm, {
		validators: zodClient(updateOfficeSchema),
		multipleSubmits: 'prevent',
		dataType: 'json'
	});

	let isOpen = $state(false);
	const { form: formData, enhance, message, delayed } = form;

	$effect(() => {
		if ($message?.status == 'success') {
			showSuccessToast($message.text);
			isOpen = false;
		}

		if ($message?.status == 'error') {
			showErrorToast($message.text);
			isOpen = false;
		}
	});

	$formData.id = id;
	const curr_under_unit = unit.units;
	const curr_office = office.offices.find((office) => office.id == $formData.id);
	$formData.unit_id = curr_office?.unit?.id;
	$formData.name = curr_office?.name;
	$formData.code = curr_office?.code;
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class=" focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} /> Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Update Office</Dialog.Title>
			<Dialog.Description>
				An office in DMMMSU is a unit tasked with specific functions to support the university's
				mission and goals.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateoffice" method="POST" use:enhance class="space-y-6">
			<div class="grid grid-cols-2 gap-4">
				<Form.Field {form} name="code">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Code</Form.Label>
							<Input {...props} bind:value={$formData.code} />
							<Form.Description>This is the acronym/code of the office.</Form.Description>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Name of the office</Form.Label>
							<Input {...props} bind:value={$formData.name} />
							<Form.Description>This is the name of the office.</Form.Description>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="flex justify-between">
				<Form.Field {form} name="unit_id">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Unit</Form.Label>
							<Select.Root
								type="single"
								value={$formData.unit_id?.toString()}
								onValueChange={(value) => {
									$formData.unit_id = parseInt(value);
								}}
								name={props.name}
							>
								<Select.Trigger {...props}>
									{$formData.unit_id
										? curr_under_unit.find((u) => u.id === $formData.unit_id)?.code
										: 'Select the unit under which this office will operate'}
								</Select.Trigger>
								<Select.Content>
									{#each curr_under_unit as unit (unit.id)}
										<Select.Item value={unit.id.toString()} label={unit.name}>
											{unit.code} - {unit.name}
										</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
							<Form.Description>
								Select the unit under which this office will operate.
							</Form.Description>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			{#if $delayed}
				<Form.Button disabled><LoaderCircle class="animate-spin" />Processing...</Form.Button>
			{:else}
				<Form.Button>Submit</Form.Button>
			{/if}
		</form>
	</Dialog.Content>
</Dialog.Root>
