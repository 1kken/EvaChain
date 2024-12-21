<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronDown } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import type { Tables } from '$lib/types/database.types';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import { getOpHeaderStore } from '../states/op_header_state';
	import { getOpHeaderFormContext } from '../states/op_header_form_state';
	import type { OpHeaderFormResult } from '../utils/type';
	import { showWarningToast, showErrorToast } from '$lib/utils/toast';
	import UpdateDialog from './sub_components/op_header/UpdateDialog.svelte';
	import OperationalProgramProject from './OperationalProgramProject.svelte';
	import { fetchOpProgramProjects } from '../utils/page_load_services';
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import { setOpProgramProjectStore } from '../states/op_program_project_state';
	import CreateDialogProgramProject from './sub_components/op_program_project/CreateDialog.svelte';
	import { slide } from 'svelte/transition';

	//props
	interface Iprops {
		opHeader: Tables<'op_header'>;
	}
	let { opHeader }: Iprops = $props();

	//stores
	const { removeOpHeader } = getOpHeaderStore();
	const { deleteForm } = getOpHeaderFormContext();
	const { currentOpProgramProjects } = setOpProgramProjectStore();

	//states
	let dndItems = $state<Tables<'op_program_project'>[]>([]);
	let isLoading = $state(false);
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let error = $state<string | null>(null);

	//functions
	function handleDelete(result: { type: string; data: OpHeaderFormResult }) {
		if (result.data.opHeader) {
			const opHeader = result.data.opHeader;
			removeOpHeader(opHeader.id);
			showWarningToast(`Successfully deleted ${opHeader.title}`);
		}
	}

	const updateOpProgramProjectPosition = async (
		items: Tables<'op_program_project'>[]
	): Promise<void> => {
		const response = await fetch('/api/op_program_project', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(items)
		});

		if (!response.ok) {
			throw new Error('Failed to update positions');
		}

		$currentOpProgramProjects = items;
	};
	$effect(() => {
		dndItems = $currentOpProgramProjects;
	});

	// Separate fetch function
	async function fetchData() {
		isLoading = true;
		error = null;

		try {
			const result = await fetchOpProgramProjects(opHeader.id);
			if (result.error) {
				error = result.error;
				showErrorToast(result.error);
				return;
			}
			dndItems = result.data;
			$currentOpProgramProjects = result.data;
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
	<header class="sticky top-0 flex h-16 items-center justify-between border-b px-4 md:px-10">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" onclick={toggleExpand}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<h2 class="text-md md:text-md text-base font-bold">{opHeader.title}</h2>
		</div>
		<div class="flex items-center gap-5">
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={opHeader.id}
					name={opHeader.title}
					action="?/deleteopheader"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateAction()}
				<UpdateDialog bind:isDrawerOpen {opHeader} />
			{/snippet}
			<div class="flex gap-4">
				<CreateDialogProgramProject opHeaderId={opHeader.id} onToggle={fetchData} bind:isExpanded />
				<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
			</div>
		</div>
	</header>

	{#if isExpanded}
		<div class="p-4" transition:slide={{ duration: 300 }}>
			{#if isLoading}
				<div class="flex justify-center">Loading program projects...</div>
			{:else if error}
				<div class="text-destructive text-center">
					{error}
				</div>
			{:else if dndItems.length === 0}
				<div class="text-muted-foreground text-center">No program projects found</div>
			{:else}
				<DndContainer
					bind:items={dndItems}
					onPositionsUpdate={updateOpProgramProjectPosition}
					emptyMessage="No program projects found"
				>
					{#each dndItems as opProgramProject (opProgramProject.id)}
						<OperationalProgramProject {opProgramProject} />
					{/each}
				</DndContainer>
			{/if}
		</div>
	{/if}
</div>
