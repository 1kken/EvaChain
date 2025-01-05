<script lang="ts">
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { getAccomplishmentProgramProjectTemplateStore } from '../states/program_project_state';
	import { getAccomplishmentProgramProjectTemplateForms } from '../utils/page_server_loader';
	import ProgramProject from './ProgramProject.svelte';

	//stores
	const { currentAccomplishmentProgramProjectsTemplate } =
		getAccomplishmentProgramProjectTemplateStore();
	//states
	let dndItems = $state<Tables<'accomplishment_template_program_project'>[]>([]);

	$effect(() => {
		dndItems = $currentAccomplishmentProgramProjectsTemplate;
	});

	const updateAccProgramProjectPosition = async (
		items: Tables<'accomplishment_template_program_project'>[]
	): Promise<void> => {
		const response = await fetch('/api/accomplishment_report_template/program_project', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(items)
		});
		if (!response.ok) {
			throw new Error('Failed to update positions');
		}
		$currentAccomplishmentProgramProjectsTemplate = items;
	};
</script>

<DndContainer
	bind:items={dndItems}
	onPositionsUpdate={updateAccProgramProjectPosition}
	emptyMessage="No Accomplishment Program/Project Found"
	successMessage="Successfully Updated Program/Project Order"
	errorMessage="Failed to Update Program/Project Order"
>
	{#each dndItems as programProject (programProject.id)}
		<div class="mt-2">
			<ProgramProject {programProject} />
		</div>
	{/each}
</DndContainer>
