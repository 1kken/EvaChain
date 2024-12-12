<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronDown } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import type { Tables } from '$lib/types/database.types';
	import { getSingleIPCRStore } from '../../(data)/(state)/ipcr-state.svelte';
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import { getSupportFunctionStore } from '../../(data)/(state)/support_function_state.svelte';
	import SupportFunctionCreateDialog from './(subcomponents)/(create_dialogs)/SupportFunctionCreateDialog.svelte';
	import SubSupportFunction from './SubSupportFunction.svelte';

	type CoreFunction = Tables<'support_function'>;

	const { currentSupportFunctions, size } = getSupportFunctionStore();

	//get store
	const { canEdit } = getSingleIPCRStore();

	let isExpanded = $state(false);
	let isLoading = $state(false);
	let showSubmit = $state(true);
	let dndItems = $state<CoreFunction[]>([]);

	$effect(() => {
		dndItems = [...$currentSupportFunctions];
	});

	const updateCoreFunctionPositions = async (items: CoreFunction[]) => {
		try {
			const response = await fetch('/api/support_function', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(items)
			});
			if (!response.ok) {
				throw new Error('Failed to update positions');
			}

			$currentSupportFunctions = items;
			return; // Return void to match the type
		} catch (error) {
			console.error('Error updating positions:', error);
			throw error;
		}
	};

	function toggleExpand() {
		isExpanded = !isExpanded;
	}
	$effect(() => {
		const length = $size;
		showSubmit = $canEdit && length > 0;
	});
</script>

<div class="w-full">
	<header
		class="sticky top-0 mt-3 flex h-16 items-center justify-between border-b border-t px-4 md:px-10"
	>
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" onclick={toggleExpand}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<h2 class="text-base font-bold md:text-xl">SUPPORT FUNCTIONS</h2>
		</div>
		<div class="flex items-center gap-5">
			{#if $canEdit}
				<SupportFunctionCreateDialog />
			{/if}
		</div>
	</header>
</div>

{#if isExpanded}
	{#snippet subSupportFunction(supportFunction: Tables<'support_function'>)}
		<SubSupportFunction {supportFunction} />
	{/snippet}
	<div class="relative space-y-4 px-4 pt-4 md:pl-14 md:pr-10">
		<DndContainer
			bind:items={dndItems}
			{isLoading}
			onPositionsUpdate={updateCoreFunctionPositions}
			emptyMessage="No Support functions found"
			successMessage="Updated Support Function Position"
			errorMessage="Failed to update support function order. Please try again."
		>
			{#each dndItems as supportFunction (supportFunction.id)}
				{@render subSupportFunction(supportFunction)}
			{/each}
		</DndContainer>
	</div>
{/if}
