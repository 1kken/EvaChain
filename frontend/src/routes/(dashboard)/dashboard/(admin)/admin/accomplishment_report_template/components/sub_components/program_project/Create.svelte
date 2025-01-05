<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Plus } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { createAccomplishmentProgramProjectSchemaTemplate } from '../../../schema/program_project_schema';
	import { getAccomplishmentProgramProjectTemplateStore } from '../../../states/program_project_state';
	import { getAccomplishmentProgramProjectTemplateFormContext } from '../../../states/program_project_form_state';
	import { getCurrentAccomplishmentReportTemplateStore } from '../../../states/accomplishment_report_state';
	import type { ProgramProjectFormResult } from '../../../utils/types';

	//stores
	const {
		currentAccomplishmentProgramProjectsTemplate,
		addAccomplishmentProgramProjectTemplate,
		size
	} = getAccomplishmentProgramProjectTemplateStore();
	const { createForm } = getAccomplishmentProgramProjectTemplateFormContext();
	const { currentAccomplishmentReportTemplate } = getCurrentAccomplishmentReportTemplateStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(createForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(createAccomplishmentProgramProjectSchemaTemplate),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentAccomplishmentProgramProjectsTemplate.some(
					(accProgramProject) => accProgramProject.program_project === form.data.program_project
				)
			) {
				setError(form, 'program_project', 'Program/Project already exists');
			}
			const action = result.data as FormResult<ProgramProjectFormResult>;
			if (form.valid && action.programProject) {
				const accProgramProject = action.programProject;
				addAccomplishmentProgramProjectTemplate(accProgramProject);
				showSuccessToast(`Successfully added Program/Project`);
				isOpen = false;
				reset({
					data: {
						accomplishment_report_template_id: $currentAccomplishmentReportTemplate?.id ?? '',
						position: $size + 1
					},
					newState: {
						accomplishment_report_template_id: $currentAccomplishmentReportTemplate?.id ?? '',
						position: $size + 1
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;

	$formData.accomplishment_report_template_id = $currentAccomplishmentReportTemplate?.id ?? '';
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
			<Dialog.Title>Add Program/Project (Template)</Dialog.Title>
			<Dialog.Description>
				Add programs and projects to track in your accomplishment report (Template).
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createaccomplishmentprogramproject" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input
				hidden
				name="accomplishment_report_template_id"
				value={$formData.accomplishment_report_template_id}
			/>
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
