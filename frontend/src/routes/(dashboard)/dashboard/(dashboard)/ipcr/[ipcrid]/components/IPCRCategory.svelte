<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { Tables } from '$lib/types/database.types';
	import { cn } from '$lib/utils';
	import { slide } from 'svelte/transition';
	import { ChevronDown } from 'lucide-svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import { showErrorToast, showWarningToast } from '$lib/utils/toast';
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import { getIpcrFunctionCategoryStore } from '../states/ipcr_category_state';
	import { getIpcrFunctionCategoryFormContext } from '../states/ipcr_category_form_state';
	import UpdateDialog from './sub_components/ipcr_category/UpdateDialog.svelte';

	//props
	interface Iprops {
		ipcrFunctionCategory: Tables<'ipcr_function_category'>;
	}
	let { ipcrFunctionCategory }: Iprops = $props();

	//states
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let dndItems: Tables<'ipcr_function_category'>[] = $state([]);

	//stores
	const { removeIpcrFunctionCategory } = getIpcrFunctionCategoryStore();
	const { deleteForm } = getIpcrFunctionCategoryFormContext();
	// const { currentOpActivities } = setOpActivityStore();

	// Separate fetch function
	// async function fetchData() {
	// 	isLoading = true;
	// 	error = null;

	// 	try {
	// 		const result = await fetchOpActivities(opObjective.id);
	// 		if (result.error) {
	// 			error = result.error;
	// 			showErrorToast(result.error);
	// 			return;
	// 		}
	// 		dndItems = result.data;
	// 		$currentOpActivities = result.data;
	// 	} catch (e) {
	// 		error = e instanceof Error ? e.message : 'An unknown error occurred';
	// 		showErrorToast(error);
	// 	} finally {
	// 		isLoading = false;
	// 	}
	// }

	//sync with store
	// $effect(() => {
	// 	dndItems = $currentOpActivities;
	// });

	// Clean toggle function
	async function toggleExpand() {
		isExpanded = !isExpanded;

		// if (isExpanded && dndItems.length === 0) {
		// 	await fetchData();
		// }
	}

	//functions
	function handleDelete(result: { type: string; data: any }) {
		if (result.data.ipcrFunctionCategory) {
			const ipcrFunctionCategory = result.data.ipcrFunctionCategory;
			removeIpcrFunctionCategory(ipcrFunctionCategory.id);
			showWarningToast(`Successfully deleted ${ipcrFunctionCategory.objective}`);
		}
	}

	// const updateOpActivityPosition = async (
	// 	items: Tables<'ipcr_function_category'>[]
	// ): Promise<void> => {
	// 	const response = await fetch('/api/ipcr_function_category', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(items)
	// 	});

	// 	if (!response.ok) {
	// 		throw new Error('Failed to update positions');
	// 	}

	// 	$ = items;
	// };
</script>

<div class="rounded-lg border">
	<div class="flex min-h-[4rem] items-center justify-between p-4">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" onclick={toggleExpand}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<div>
				<h1 class="text-sm">{ipcrFunctionCategory.category}</h1>
			</div>
		</div>
		<div class="flex items-center gap-5">
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={ipcrFunctionCategory.id}
					action="?/deleteipcrfunctioncategory"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateAction()}
				<UpdateDialog bind:isDrawerOpen {ipcrFunctionCategory} />
			{/snippet}
			<div class="flex gap-4">
				<!-- <CreateDialog opObjectiveId={opObjective.id} onToggle={fetchData} bind:isExpanded /> -->
				<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
			</div>
		</div>
	</div>

	<!-- {#if isExpanded}
		<div class="border-t p-4" transition:slide={{ duration: 300 }}>
			{#if isLoading}
				<div class="flex justify-center">Loading activities...</div>
			{:else if error}
				<div class="text-destructive text-center">
					{error}
				</div>
			{:else if dndItems.length === 0}
				<div class="text-muted-foreground text-center">No activities found</div>
			{:else}
				<DndContainer
					bind:items={dndItems}
					onPositionsUpdate={updateOpActivityPosition}
					emptyMessage="No activities found"
					successMessage="Updated positions successfully"
					errorMessage="Failed to update order. Please try again."
				>
					{#each dndItems as item (item.id)}
						<OperationalActivity opActivity={item} />
					{/each}
				</DndContainer>
			{/if}
		</div>
	{/if} -->
</div>
