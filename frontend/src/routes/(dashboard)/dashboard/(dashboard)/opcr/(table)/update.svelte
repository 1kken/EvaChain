<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { GripHorizontal, Pencil, Plus, Save, Trash2 } from 'lucide-svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import SuperDebug, {
		type SuperValidated,
		type Infer,
		superForm,
		type FormResult
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { checkProfileCompletion } from '$lib/utils/missingDetailsToast';
	import Button from '$lib/components/ui/button/button.svelte';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import type { Tables } from '$lib/types/database.types';
	import { updateOpcrSchema, type UpdateOpcrInput } from '../(data)/opcr_schema';
	import { getOpcrStore } from '../(data)/opcr_state';
	import type { OPCRFormResult } from '../(data)/types';

	let {
		updateForm,
		id,
		dropDownOpen = $bindable()
	}: {
		updateForm: SuperValidated<UpdateOpcrInput>;
		id: string;
		dropDownOpen?: boolean;
	} = $props();

	let isOpen = $state(false);
	//Stores
	const { updateOpcr, currentOpcrs } = getOpcrStore();

	//variables
	const flipDurationMs = 300;
	const form = superForm(updateForm, {
		validators: zodClient(updateOpcrSchema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<OPCRFormResult>;
			if (form.valid && action.opcr) {
				const opcr = action.opcr;
				updateOpcr(opcr.id, opcr);
				showSuccessToast(`Succesfully updated DPCR ${opcr.title}`);
				isOpen = false;
				dropDownOpen = false;
			}
		}
	});

	const { form: formData, enhance, message, delayed, reset, errors } = form;

	$effect(() => {
		if ($message?.status == 'success') {
			showSuccessToast($message.text);
			isOpen = false;
			reset({});
		}

		if ($message?.status == 'error') {
			showErrorToast($message.text);
			reset({});
		}
	});

	const currentOpcr = $currentOpcrs.find((opcr) => opcr.id === id);

	if (currentOpcr) {
		$formData.id = id.toString();
		$formData.title = currentOpcr.title;
		$formData.review_by = currentOpcr.review_by;
		$formData.reviewer_position = currentOpcr.reviewer_position;
		$formData.planning_officer = currentOpcr.planning_officer;
		$formData.human_resource = currentOpcr.human_resource;
		$formData.administrative_officer = currentOpcr.administrative_officer;
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class=" focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} /> Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title>Office Performance Commitment And Review (OPCR)</Dialog.Title>
			<Dialog.Description>
				An OPCR is a document that outlines the performance targets and accomplishments of an office
				for a given period. It is a tool for performance management and accountability.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateopcr" method="POST" use:enhance>
			<input type="text" hidden bind:value={$formData.id} name="id" />
			<Form.Field {form} name="title">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Title</Form.Label>
						<Input {...props} bind:value={$formData.title} />
					{/snippet}
				</Form.Control>
				<Form.Description
					>A descriptive name automatically inferred from the year of creation, typically reflecting
					the plan's timeframe (e.g., "DPCR 2024").</Form.Description
				>
				<Form.FieldErrors />
			</Form.Field>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Form.Field {form} name="review_by">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Reviewer's Name</Form.Label>
							<Input {...props} bind:value={$formData.review_by} placeholder="Juan De La D. Cruz" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="reviewer_position">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Reviewer's Position</Form.Label>
							<Input
								{...props}
								bind:value={$formData.reviewer_position}
								placeholder="e.g president.."
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Form.Field {form} name="planning_officer">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Planning Officer's Name</Form.Label>
							<Input
								{...props}
								bind:value={$formData.planning_officer}
								placeholder="Juan De La D. Cruz"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="human_resource">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Human Resource's Name</Form.Label>
							<Input
								{...props}
								bind:value={$formData.human_resource}
								placeholder="Juan De La D. Cruz"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<Form.Field {form} name="administrative_officer">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Administrative Officer's Name</Form.Label>
						<Input
							{...props}
							bind:value={$formData.administrative_officer}
							placeholder="Juan De La D. Cruz"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			{#if $delayed}
				<Form.Button class="w-full" disabled
					><LoaderCircle class="animate-spin" />Processing...</Form.Button
				>
			{:else}
				<Form.Button class="w-full"><Save />Save</Form.Button>
			{/if}
		</form>
	</Dialog.Content>
</Dialog.Root>
