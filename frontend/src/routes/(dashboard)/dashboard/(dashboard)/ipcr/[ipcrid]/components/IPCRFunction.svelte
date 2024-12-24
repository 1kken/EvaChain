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
	import { getIpcrFunctionFormContext } from '../states/ipcr_function_form_state';
	import { get } from 'svelte/store';
	import { getIpcrFunctionStore } from '../states/ipcr_function_state';
	import type { IPCRFunctionFormResult } from '../utils/types';
	import UpdateDialog from './sub_components/ipcr_function/UpdateDialog.svelte';
	import { fetchIpcrFunctionCategories } from '../utils/page_loader_services';
	import { setIpcrFunctionCategoryStore } from '../states/ipcr_category_state';
	import IpcrCategory from './IPCRCategory.svelte';
	import CreateDialog from './sub_components/ipcr_category/CreateDialog.svelte';
	import CreateIndicatorDialog from './sub_components/ipcr_indicator/CreateDialog.svelte';
	import { setIpcrIndicatorStore } from '../states/ipcr_indicator_state';

	//props
	interface Iprops {
		ipcrFunction: Tables<'ipcr_function'>;
	}
	let { ipcrFunction }: Iprops = $props();

	//if core function
	const regex = /core functions/i;

	// Check if the regex matches the text
	const isCoreFunction = regex.test(ipcrFunction.title);

	//stores
	const { deleteForm } = getIpcrFunctionFormContext();
	const { removeIpcrFunction } = getIpcrFunctionStore();
	const { currentIpcrFunctionCategories } = setIpcrFunctionCategoryStore();
	const { currentIpcrIndicators } = setIpcrIndicatorStore();

	//states
	let dndItems = $state<Tables<'ipcr_function_category'>[]>([]);
	let isLoading = $state(false);
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let isAddDrawerOpen = $state(false);
	let error = $state<string | null>(null);

	//functions
	function handleDelete(result: { type: string; data: IPCRFunctionFormResult }) {
		if (result.data.ipcrFunction) {
			const ipcrFunction = result.data.ipcrFunction;
			removeIpcrFunction(ipcrFunction.id);
			showWarningToast(`Successfully deleted ${ipcrFunction.title}`);
		}
	}

	const updateIpcrFunctionCategoryPosition = async (
		items: Tables<'ipcr_function_category'>[]
	): Promise<void> => {
		const response = await fetch('/api/ipcr_function_category', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(items)
		});

		if (!response.ok) {
			throw new Error('Failed to update positions');
		}

		$currentIpcrFunctionCategories = items;
	};
	$effect(() => {
		dndItems = $currentIpcrFunctionCategories;
	});

	// // Separate fetch function
	async function fetchData() {
		isLoading = true;
		error = null;

		try {
			const result = await fetchIpcrFunctionCategories(ipcrFunction.id);
			if (result.error) {
				error = result.error;
				showErrorToast(result.error);
				return;
			}
			dndItems = result.data;
			$currentIpcrFunctionCategories = result.data;
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
			<h2 class="text-md md:text-md text-base font-bold">{ipcrFunction.title}</h2>
		</div>
		<div class="flex items-center gap-5">
			{#snippet createDialog()}
				<CreateDialog bind:isDrawerOpen={isAddDrawerOpen} ipcrFunctionId={ipcrFunction.id} />
			{/snippet}
			{#snippet createIndicatorDialog()}
				<CreateIndicatorDialog
					bind:isDrawerOpen={isAddDrawerOpen}
					ipcrFunctionId={ipcrFunction.id}
				/>
			{/snippet}
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={ipcrFunction.id}
					name={ipcrFunction.title}
					action="?/deleteipcrfunction"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateAction()}
				<UpdateDialog bind:isDrawerOpen {ipcrFunction} />
			{/snippet}
			<div class="flex gap-4">
				<DropDownWrapper
					icon={ChevronDown}
					text={'Add options'}
					childrens={[createDialog, createIndicatorDialog]}
					bind:isDrawerOpen={isAddDrawerOpen}
				/>
				{#if !isCoreFunction}
					<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
				{/if}
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
					onPositionsUpdate={updateIpcrFunctionCategoryPosition}
					emptyMessage="No function category found"
				>
					{#each dndItems as ipcrFunctionCategory (ipcrFunctionCategory.id)}
						<IpcrCategory {ipcrFunctionCategory} />
					{/each}
				</DndContainer>
			{/if}
		</div>
	{/if}
</div>
