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
	import { createProgramSchema, type CreateProgram } from '$lib/schemas/program/schema';
	import type { Tables } from '$lib/types/database.types';
	import type { Office } from '../../office/(table)/column';

	let {
		data,
		units,
		offices
	}: { data: SuperValidated<CreateProgram>; units: Tables<'unit'>[]; offices: Office[] } = $props();

	let isOpen = $state(false);
	const form = superForm(data, {
		validators: zodClient(createProgramSchema),
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

	const curr_under_unit = $derived(units);
	const curr_under_office = $derived(offices);

	let curr_unit = $state<Tables<'unit'> | undefined>(undefined);

	function findUnit() {
		const in_office = curr_under_office.find((o) => o.id === $formData.office_id);
		const in_unit = curr_under_unit.find((u) => u.id === in_office?.unit?.id);
		console.log(in_unit?.id);
		curr_unit = in_unit;
		if (in_unit) {
			$formData.unit_id = in_unit.id;
		}
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>
		<Plus /> Create Program
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Create Program</Dialog.Title>
			<Dialog.Description>
				DMMMSU programs are structured academic offerings designed to develop skills and knowledge
				in various fields, supporting student growth and career readiness.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createprogram" method="POST" use:enhance class="space-y-6">
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Name</Form.Label>
						<Input {...props} bind:value={$formData.name} />
						<Form.Description>This is the name of the program.</Form.Description>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="grid grid-cols-2 gap-4">
				<Form.Field {form} name="office_id">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Office</Form.Label>
							<Select.Root
								type="single"
								value={$formData.office_id?.toString()}
								onValueChange={(value) => {
									$formData.office_id = parseInt(value);
									findUnit();
								}}
								name={props.name}
							>
								<Select.Trigger {...props} class="truncate">
									{$formData.office_id
										? curr_under_office.find((o) => o.id === $formData.office_id)?.name
										: 'Select the unit under which this office will operate'}
								</Select.Trigger>
								<Select.Content>
									{#each curr_under_office as office (office.id)}
										<Select.Item value={office.id.toString()} label={office.name}>
											{office.code} - {office.name}
										</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
							<Form.Description>
								Select the office under which this program will operate
							</Form.Description>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="unit_id">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Unit</Form.Label>
							<Select.Root
								disabled
								type="single"
								value={$formData.unit_id?.toString()}
								name={props.name}
							>
								<Select.Trigger {...props} class="truncate">
									{curr_unit
										? `${curr_unit.code} - ${curr_unit.name}`
										: 'Select office to automatically asign unit'}
								</Select.Trigger>
							</Select.Root>
							<Form.Description
								>Select office to <span class=" font-bold"> automatically</span> asign unit
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
