<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import SuperDebug, { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import type { OpObjectiveFormResult } from '../../../utils/type';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { getOpObjectiveStore } from '../../../states/op_objective_state';
	import { getOpObjectiveFormContext } from '../../../states/op_objective_form_state';
	import { createOpObjectiveSchema } from '../../../schema/op_objective_schema';
	import { browser } from '$app/environment';

	//props
	interface Iprops {
		opProgramProjectId: string;
		isExpanded: boolean;
		onToggle: () => Promise<void>;
	}
	let { opProgramProjectId, onToggle, isExpanded = $bindable() }: Iprops = $props();

	//stores
	const { createForm } = getOpObjectiveFormContext();
	const { size, addOpObjective, currentOpObjectives } = getOpObjectiveStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(createForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(createOpObjectiveSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentOpObjectives.some(
					(opObjective) =>
						opObjective.objective.toLocaleLowerCase() === form.data.objective.toLowerCase()
				)
			) {
				setError(form, 'objective', 'Objective already exists');
			}
			const action = result.data as FormResult<OpObjectiveFormResult>;
			if (form.valid && action.opObjective) {
				const opObjective = action.opObjective;
				addOpObjective(opObjective);
				showSuccessToast(`successfully added Objective to the Program/Project`);
				isOpen = false;
				isExpanded = true;
				reset({
					data: { op_program_project_id: opObjective.op_program_project_id, position: $size + 1 },
					newState: {
						op_program_project_id: opObjective.op_program_project_id,
						position: $size + 1
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	// //set data that is needed
	$effect(() => {
		if (opProgramProjectId) {
			$formData.op_program_project_id = opProgramProjectId;
			$formData.position = $size + 1;
		}
	});

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding operational header: ${$message.text}`);
		}
	});
</script>

<Dialog.Root bind:open={isOpen} onOpenChange={onToggle}>
	<Dialog.Trigger class="focus-visible:outline-none" id="nav-2">
		<span class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			<span class="hidden md:inline">Add Objective</span>
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
		<form action="?/createopobjectives" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input hidden name="operational_plan_id" value={$formData.op_program_project_id} />
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
		</form>
		{#if browser}
			<SuperDebug data={$formData} />
		{/if}
	</Dialog.Content>
</Dialog.Root>
