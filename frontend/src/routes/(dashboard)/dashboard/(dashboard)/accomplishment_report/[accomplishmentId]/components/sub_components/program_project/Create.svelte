<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Plus } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { getAccomplishmentProgramProjectFormContext } from '../../../states/program_project_form_state';
	import { getAccomplishmentProgramProjectStore } from '../../../states/program_project_state';
	import { createAccomplishmentProgramProjectSchema } from '../../../schema/program_project_schema';
	import type { ProgramProjectFormResult } from '../../../utils/type';
	import { getCurrentAccomplishmentReportStore } from '../../../states/current_accomplishment_report_state';

	//stores
	const { createForm } = getAccomplishmentProgramProjectFormContext();
	const { currentAccomplishmentProgramProjects, addAccomplishmentProgramProject, size } =
		getAccomplishmentProgramProjectStore();
	const { currentAccomplishmentReport } = getCurrentAccomplishmentReportStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(createForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(createAccomplishmentProgramProjectSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentAccomplishmentProgramProjects.some(
					(project) => project.program_project === form.data.program_project
				)
			) {
				setError(form, 'program_project', 'Program/Project already exists');
			}
			const action = result.data as FormResult<ProgramProjectFormResult>;
			if (form.valid && action.programProject) {
				const accProgramProject = action.programProject;
				addAccomplishmentProgramProject(accProgramProject);
				showSuccessToast(`Successfully added Program/Project`);
				isOpen = false;
				reset({
					data: {
						accomplishment_report_id: accProgramProject.accomplishment_report_id,
						position: $size + 1
					},
					newState: {
						accomplishment_report_id: accProgramProject.accomplishment_report_id,
						position: $size + 1
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;

	$formData.accomplishment_report_id = $currentAccomplishmentReport?.id ?? 'error';
	$formData.position = $size + 1;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding program/project: ${$message.text}`);
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
				Add programs and projects to track in your accomplishment report.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createaccomplishmentprogramproject" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input hidden name="accomplishment_report_id" value={$formData.accomplishment_report_id} />
			<Form.Field {form} name="program_project">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Program/Project Name</Form.Label>
						<IntelligentInput
							textAreaWidth={'full'}
							placeholder="Enter name of the program/project"
							bind:content={$formData.program_project}
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
