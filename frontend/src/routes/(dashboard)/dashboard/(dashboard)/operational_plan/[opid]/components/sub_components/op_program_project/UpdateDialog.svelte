<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import type { OpProgramProjectFormResult } from '../../../utils/type';
	import { getOpProgramProjectFormContext } from '../../../states/op_program_project_form_state';
	import { getOpProgramProjectStore } from '../../../states/op_program_project_state';
	import {
		createOpProgramProjectSchema,
		updateOpProgramProjectSchema
	} from '../../../schema/op_project_program_schema';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import type { Tables } from '$lib/types/database.types';

	//props
	interface Iprops {
		opProgramProject: Tables<'op_program_project'>;
		isDrawerOpen: boolean;
	}
	let { opProgramProject, isDrawerOpen = $bindable() }: Iprops = $props();

	//stores
	const { updateForm } = getOpProgramProjectFormContext();
	const { updateOpProgramProject, currentOpProgramProjects } = getOpProgramProjectStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateOpProgramProjectSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentOpProgramProjects.some(
					(opProgramProject) => opProgramProject.description === form.data.description
				)
			) {
				setError(form, 'description', 'Description already exists');
			}
			const action = result.data as FormResult<OpProgramProjectFormResult>;
			if (form.valid && action.opProgramProject) {
				const opProgramProject = action.opProgramProject;
				updateOpProgramProject(opProgramProject.id, opProgramProject);
				showSuccessToast(`Succesfully updated Program/Project to the header`);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: { id: opProgramProject.id, description: opProgramProject.description },
					newState: { id: opProgramProject.id, description: opProgramProject.description }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	$formData.description = opProgramProject.description;
	$formData.id = opProgramProject.id;

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
			<Dialog.Title>Add Program/Project</Dialog.Title>
			<Dialog.Description>
				Targeted initiatives to achieve strategic goals in key areas like instruction, research, and
				development.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateopprogramproject" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
			<Form.Field {form} name="description">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Title</Form.Label>
						<IntelligentInput
							textAreaWidth={'full'}
							placeholder="Enter decription of the program project"
							bind:content={$formData.description}
							name={props.name}
						/>
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
