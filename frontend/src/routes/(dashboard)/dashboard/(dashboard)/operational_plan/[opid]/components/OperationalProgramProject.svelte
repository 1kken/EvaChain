<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { Tables } from '$lib/types/database.types';
	import { cn } from '$lib/utils';
	import { ChevronDown } from 'lucide-svelte';
	import UpdateDialog from './sub_components/op_program_project/UpdateDialog.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import { getOpProgramProjectStore } from '../states/op_program_project_state';
	import { showErrorToast, showWarningToast } from '$lib/utils/toast';
	import { getOpProgramProjectFormContext } from '../states/op_program_project_form_state';
	import { setOpObjectiveStore } from '../states/op_objective_state';
	import { fetchOpObjectives } from '../utils/page_load_services';
	import OperationalObjective from './OperationalObjective.svelte';
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import CreateDialog from './sub_components/op_objectives/CreateDialog.svelte';
	import { slide } from 'svelte/transition';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	//props
	interface Iprops {
		opProgramProject: Tables<'op_program_project'>;
	}
	let { opProgramProject }: Iprops = $props();
	//states
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let dndItems: Tables<'op_objective'>[] = $state([]);

	//stores
	const { removeOpProgramProject } = getOpProgramProjectStore();
	const { deleteForm } = getOpProgramProjectFormContext();

	const { currentOpObjectives } = setOpObjectiveStore();

	//functions
	function handleDelete(result: { type: string; data: any }) {
		if (result.data.opProgramProject) {
			const opProgramProject = result.data.opProgramProject;
			removeOpProgramProject(opProgramProject.id);
			showWarningToast(`Successfully deleted ${opProgramProject.description}`);
		}
	}

	//handle fetching
	const updateOpObjectivePosition = async (items: Tables<'op_objective'>[]): Promise<void> => {
		const response = await fetch('/api/op_objective', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(items)
		});

		if (!response.ok) {
			throw new Error('Failed to update positions');
		}

		$currentOpObjectives = items;
	};
	$effect(() => {
		dndItems = $currentOpObjectives;
	});
	async function fetchData() {
		isLoading = true;
		error = null;

		try {
			const result = await fetchOpObjectives(opProgramProject.id);
			if (result.error) {
				error = result.error;
				showErrorToast(result.error);
				return;
			}
			dndItems = result.data;
			$currentOpObjectives = result.data;
		} catch (e) {
			error = e instanceof Error ? e.message : 'An unknown error occurred';
			showErrorToast(error);
		} finally {
			isLoading = false;
		}
	}

	// Clean toggle function
	async function toggleExpand() {
		isExpanded = !isExpanded;

		if (isExpanded && dndItems.length === 0) {
			await fetchData();
		}
	}
</script>

<div class="rounded-lg border">
	<div class="flex h-10 items-center justify-between p-4">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" onclick={toggleExpand}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<div class="flex flex-row space-x-2">
				<Badge variant={'secondary'} class="h-5 text-xs">Prorgam/Project</Badge>
				<h1 class="text-sm">{opProgramProject.description}</h1>
			</div>
		</div>
		<div class="flex items-center gap-5">
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={opProgramProject.id}
					action="?/deleteopprogramproject"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateAction()}
				<UpdateDialog bind:isDrawerOpen {opProgramProject} />
			{/snippet}
			<div class="flex gap-4">
				<CreateDialog
					opProgramProjectId={opProgramProject.id}
					bind:isExpanded
					onToggle={fetchData}
				/>
				<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
			</div>
		</div>
	</div>

	{#if isExpanded}
		<div class="p-4" transition:slide={{ duration: 300 }}>
			<div class="border-t p-4">
				{#snippet dndItem(opObjective: Tables<'op_objective'>)}
					<OperationalObjective {opObjective} />
				{/snippet}

				<DndContainer
					bind:items={dndItems}
					{isLoading}
					onPositionsUpdate={updateOpObjectivePosition}
					emptyMessage="No objectives found"
					successMessage="Updated positions successfully"
					errorMessage="Failed to update order. Please try again."
				>
					{#each dndItems as item (item.id)}
						{@render dndItem(item)}
					{/each}
				</DndContainer>
			</div>
		</div>
	{/if}
</div>
