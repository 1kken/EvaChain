<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil, Plus } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { getAccomplishmentProgramProjectFormContext } from '../../../states/program_project_form_state';
	import { getAccomplishmentProgramProjectStore } from '../../../states/program_project_state';
	import {
		createAccomplishmentProgramProjectSchema,
		updateAccomplishmentProgramProjectSchema
	} from '../../../schema/program_project_schema';
	import type { ProgramProjectFormResult } from '../../../utils/type';
	import { getCurrentAccomplishmentReportStore } from '../../../states/current_accomplishment_report_state';
	import type { Tables } from '$lib/types/database.types';

	//props
	interface IProps {
		programProject: Tables<'accomplishment_program_project'>;
		isDrawerOpen: boolean;
	}

	let { programProject, isDrawerOpen = $bindable() }: IProps = $props();

	//stores
	const { updateForm } = getAccomplishmentProgramProjectFormContext();
	const { currentAccomplishmentProgramProjects, updateAccomplishmentProgramProject } =
		getAccomplishmentProgramProjectStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateAccomplishmentProgramProjectSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentAccomplishmentProgramProjects.some(
					(project) =>
						project.program_project === form.data.program_project &&
						project.id !== programProject.id
				)
			) {
				setError(form, 'program_project', 'Program/Project already exists');
			}
			const action = result.data as FormResult<ProgramProjectFormResult>;
			if (form.valid && action.programProject) {
				const accProgramProject = action.programProject;
				updateAccomplishmentProgramProject(accProgramProject.id, accProgramProject);
				showSuccessToast(`Successfully added Program/Project`);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: {
						program_project: accProgramProject.program_project,
						id: accProgramProject.id
					},
					newState: {
						program_project: accProgramProject.program_project,
						id: accProgramProject.id
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	$formData.id = programProject.id;
	$formData.program_project = programProject.program_project;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding program/project: ${$message.text}`);
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
			<Dialog.Title>Edit Program/Project</Dialog.Title>
			<Dialog.Description>
				Edit programs and projects to track in your accomplishment report.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateaccomplishmentprogramproject" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
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
