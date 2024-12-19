<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import type { OpProgramProjectFormResult } from '../../../utils/type';
	import { getOpProgramProjectFormContext } from '../../../states/op_program_project_form_state';
	import { getOpProgramProjectStore } from '../../../states/op_program_project_state';
	import { createOpProgramProjectSchema } from '../../../schema/op_project_program_schema';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';

	//props
	interface Iprops {
		opHeaderId: string;
	}
	let { opHeaderId }: Iprops = $props();

	//stores
	const { createForm } = getOpProgramProjectFormContext();
	const { size, addOpProgramProject, currentOpProgramProjects } = getOpProgramProjectStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(createForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(createOpProgramProjectSchema),
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
				addOpProgramProject(opProgramProject);
				showSuccessToast(`Succesfully added Program/Project to the header`);
				isOpen = false;
				reset({
					data: { op_header_id: opProgramProject.op_header_id, position: $size + 1 },
					newState: { op_header_id: opProgramProject.op_header_id, position: $size + 1 }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	// //set data that is needed
	$effect(() => {
		if (opHeaderId) {
			$formData.op_header_id = opHeaderId;
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

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none" id="nav-2">
		<span class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			<span class="hidden md:inline">Add Program/Project</span>
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
		<form action="?/createopprogramproject" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input hidden name="operational_plan_id" value={$formData.op_header_id} />
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
