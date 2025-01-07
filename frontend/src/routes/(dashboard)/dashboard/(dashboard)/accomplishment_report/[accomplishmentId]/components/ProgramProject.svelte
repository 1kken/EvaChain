<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronDown } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import type { Tables } from '$lib/types/database.types';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import { showWarningToast, showErrorToast } from '$lib/utils/toast';
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import { slide } from 'svelte/transition';
	import { getAccomplishmentProgramProjectFormContext } from '../states/program_project_form_state';
	import { getAccomplishmentProgramProjectStore } from '../states/program_project_state';
	import type { ProgramProjectFormResult } from '../utils/type';
	import Update from './sub_components/program_project/Update.svelte';
	import {
		getAccomplishmentMetricsStore,
		setAccomplishmentMetricsStore
	} from '../states/metrics_state';
	import { fetchMetrics } from '../utils/page_loader';
	import Create from './sub_components/metrics/Create.svelte';
	import Metric from './Metric.svelte';
	import { getCurrentAccomplishmentReportStore } from '../states/current_accomplishment_report_state';
	import ToggleInclude from './sub_components/program_project/ToggleInclude.svelte';

	//props
	interface Iprops {
		programProject: Tables<'accomplishment_program_project'>;
	}
	let { programProject }: Iprops = $props();

	//stores
	const { deleteForm } = getAccomplishmentProgramProjectFormContext();
	const { removeAccomplishmentProgramProject } = getAccomplishmentProgramProjectStore();
	const { currentAccomplishmentMetrics } = setAccomplishmentMetricsStore();
	const { isUsingTemplate } = getCurrentAccomplishmentReportStore();

	//states
	let dndItems = $state<Tables<'accomplishment_metrics'>[]>([]);
	let isLoading = $state(false);
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let error = $state<string | undefined>();

	//functions
	function handleDelete(result: { type: string; data: ProgramProjectFormResult }) {
		if (result.data.programProject) {
			const programProject = result.data.programProject;
			removeAccomplishmentProgramProject(programProject.id);
			showWarningToast(`Successfully deleted ${programProject.program_project}`);
		}
	}

	const updateMetricsPosition = async (
		items: Tables<'accomplishment_metrics'>[]
	): Promise<void> => {
		const response = await fetch('/api/accomplishment_report/metrics', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(items)
		});

		if (!response.ok) {
			throw new Error('Failed to update positions');
		}

		$currentAccomplishmentMetrics = items;
	};
	$effect(() => {
		dndItems = $currentAccomplishmentMetrics;
	});

	// Separate fetch function
	async function fetchData() {
		isLoading = true;
		error = undefined;

		try {
			const result = await fetchMetrics(programProject.id);
			if (result.error) {
				error = result.error;
				showErrorToast(result.error);
				return;
			}
			dndItems = result.data;
			$currentAccomplishmentMetrics = result.data;
		} catch (e) {
			error = e instanceof Error ? e.message : 'An unknown error occurred';
			showErrorToast(error);
		} finally {
			isLoading = false;
		}
	}

	// Simplified toggle function
	async function toggleExpand() {
		isExpanded = !isExpanded;

		if (isExpanded && dndItems.length === 0) {
			await fetchData();
		}
	}
</script>

<div class="w-full">
	<header class="sticky top-0 flex h-10 items-center justify-between border-b px-4 md:px-10">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" onclick={toggleExpand}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<h2
				class={cn('text-md md:text-md text-base font-bold', {
					'line-through': !programProject.is_included
				})}
			>
				{programProject.program_project}
			</h2>
		</div>
		<div class="flex items-center gap-5">
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={programProject.id}
					name={programProject.program_project}
					action="?/deleteaccomplishmentprogramproject"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateAction()}
				<Update bind:isDrawerOpen {programProject} />
			{/snippet}
			{#if !$isUsingTemplate}
				<div class="flex gap-4">
					<Create programProjectId={programProject.id} />
					<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
				</div>
			{:else}
				<ToggleInclude {programProject} />
			{/if}
		</div>
	</header>

	{#if isExpanded}
		<div class="p-4" transition:slide={{ duration: 300 }}>
			<DndContainer
				{isLoading}
				errorMessage={error}
				bind:items={dndItems}
				onPositionsUpdate={updateMetricsPosition}
				emptyMessage="No metrics found"
			>
				{#each dndItems as metric (metric.id)}
					<Metric {metric} />
				{/each}
			</DndContainer>
		</div>
	{/if}
</div>
