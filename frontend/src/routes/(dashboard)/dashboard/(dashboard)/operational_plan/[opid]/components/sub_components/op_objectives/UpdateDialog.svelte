<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil } from 'lucide-svelte';
	import SuperDebug, { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import type { OpObjectiveFormResult } from '../../../utils/type';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { getOpObjectiveStore } from '../../../states/op_objective_state';
	import { getOpObjectiveFormContext } from '../../../states/op_objective_form_state';
	import { updateOpObjectiveSchema } from '../../../schema/op_objective_schema';
	import { browser } from '$app/environment';
	import type { Tables } from '$lib/types/database.types';

	//props
	interface Iprops {
		opObjective: Tables<'op_objective'>;
		isDrawerOpen: boolean;
	}
	let { opObjective, isDrawerOpen = $bindable() }: Iprops = $props();

	//stores
	const { updateForm } = getOpObjectiveFormContext();
	const { updateOpObjective, currentOpObjectives } = getOpObjectiveStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateOpObjectiveSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentOpObjectives.some(
					(opObjective) => opObjective.objective.toLowerCase() === form.data.objective.toLowerCase()
				)
			) {
				setError(form, 'objective', 'Objective already exists');
			}
			const action = result.data as FormResult<OpObjectiveFormResult>;
			if (form.valid && action.opObjective) {
				isDrawerOpen = false;
				isOpen = false;
				const opObjective = action.opObjective;
				updateOpObjective(opObjective.id, opObjective);
				showSuccessToast(`successfully added Objective to the Program/Project`);
				isOpen = false;
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	$formData.id = opObjective.id;
	$formData.objective = opObjective.objective;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding operational header: ${$message.text}`);
		}
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} />Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Add Objectives & Activities</Dialog.Title>
			<Dialog.Description>
				Program/Project Objective: A concise statement outlining the goals and intended outcomes of
				the program or project.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateopobjectives" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
			<Form.Field {form} name="objective">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Objective</Form.Label>
						<IntelligentInput
							textAreaWidth={'full'}
							placeholder="Enter the objective for the program/project."
							bind:content={$formData.objective}
							name={props.name}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			{#if $delayed}
				<Form.Button disabled><LoaderCircle class="animate-spin" />Processing...</Form.Button>
			{:else}
				<Form.Button>Submit</Form.Button>
			{/if}

			{#if browser}
				<SuperDebug data={$formData} />
			{/if}
		</form></Dialog.Content
	>
</Dialog.Root>
