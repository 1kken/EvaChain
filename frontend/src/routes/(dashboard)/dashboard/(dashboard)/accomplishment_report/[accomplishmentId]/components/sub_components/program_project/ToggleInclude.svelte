<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import type { Tables } from '$lib/types/database.types';
	import { CircleCheckBig, CircleOff, TriangleAlert } from 'lucide-svelte';
	import { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toggleIsIncludeProgramProjectSchema } from '../../../schema/program_project_schema';
	import type { ProgramProjectFormResult } from '../../../utils/type';
	import { showErrorToast, showSuccessToast, showWarningToast } from '$lib/utils/toast';
	import { Input } from '$lib/components/ui/input';
	import { getAccomplishmentProgramProjectFormContext } from '../../../states/program_project_form_state';
	import { getAccomplishmentProgramProjectStore } from '../../../states/program_project_state';
	import { getAccomplishmentMetricsStore } from '../../../states/metrics_state';

	// props
	interface IProps {
		programProject: Tables<'accomplishment_program_project'>;
	}

	let { programProject }: IProps = $props();

	// stores
	const { toggleIsIncludeForm } = getAccomplishmentProgramProjectFormContext();
	const { updateAccomplishmentProgramProject } = getAccomplishmentProgramProjectStore();
	const { currentAccomplishmentMetrics } = getAccomplishmentMetricsStore();

	// states
	let isOpen = $state(false);

	// form
	const form = superForm(toggleIsIncludeForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(toggleIsIncludeProgramProjectSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<ProgramProjectFormResult>;
			if (form.valid && action.programProject) {
				const updatedProgram = action.programProject;

				if (updatedProgram.is_included) {
					showSuccessToast(
						`Successfully included program/project: ${updatedProgram.program_project}`
					);
				} else {
					showWarningToast(
						`Successfully excluded program/project: ${updatedProgram.program_project}`
					);
				}
				updateAccomplishmentProgramProject(updatedProgram.id, updatedProgram);
				toggleIsIncludeMetricsUnderProgramProject(updatedProgram.id);
				isOpen = false;
				reset({
					data: {
						...updatedProgram
					},
					newState: {
						...updatedProgram
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	$formData.id = programProject.id;

	// effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error updating program/project: ${$message.text}`);

			reset({
				data: {
					...programProject
				},
				newState: {
					...programProject
				}
			});
		}
	});

	//helpers

	export function toggleIsIncludeMetricsUnderProgramProject(programProjectId: string) {
		$currentAccomplishmentMetrics.forEach((metric) => {
			if (metric.accomplishment_program_project_id === programProjectId) {
				metric.is_included = !metric.is_included;
			}
		});
	}
</script>

<AlertDialog.Root bind:open={isOpen}>
	<AlertDialog.Trigger class="focus-visible:outline-none">
		{#if programProject.is_included}
			<span class="flex items-center gap-3">
				<CircleOff size={16} /> Exclude Program/Project
			</span>
		{:else}
			<span class="flex items-center gap-3">
				<CircleCheckBig size={16} /> Include Program/Project
			</span>
		{/if}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				<span class="flex items-center gap-4">
					<TriangleAlert class="text-yellow-600" /> Are you absolutely sure?
				</span>
			</AlertDialog.Title>
			<AlertDialog.Description>
				{programProject.is_included
					? 'This program/project and all its metrics will be excluded from the final report. You can add them back using the "Include" button.'
					: 'This program/project will be included in the final report. You can remove it using the "Exclude" button.'}
			</AlertDialog.Description>
		</AlertDialog.Header>

		<form method="POST" action="?/toggleisincludeprogramproject" use:enhance>
			<Input name="id" class="hidden" bind:value={$formData.id} />
			<AlertDialog.Footer>
				<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
				<AlertDialog.Action>Continue</AlertDialog.Action>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
