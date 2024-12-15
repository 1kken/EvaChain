<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronDown } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import type { Tables } from '$lib/types/database.types';
	import CoreFunctionCreateDialog from './(subcomponents)/(create_dialogs)/CoreFunctionCreateDialog.svelte';
	import SubCoreFunction from './SubCoreFunction.svelte';
	import { getCoreFunctionStore } from '../../(data)/(state)/corefunctionstate.svelte';
	import SubmitIpcrAction from '../SubmitIPCRAction.svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { SubmitIPCRSchema } from '../../../utils/schemas/submit_ipcr_schema';
	import { getSingleIPCRStore } from '../../(data)/(state)/ipcr-state.svelte';
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';

	type CoreFunction = Tables<'core_function'>;

	const { currentCoreFunctions } = getCoreFunctionStore();

	interface Props {
		submitIPCRForm: SuperValidated<Infer<SubmitIPCRSchema>>;
	}
	let { submitIPCRForm }: Props = $props();

	//get store
	const { currentIPCR: ipcr, canEdit } = getSingleIPCRStore();

	let isExpanded = $state(false);
	let isLoading = $state(false);
	let dndItems = $state<CoreFunction[]>([]);

	$effect(() => {
		dndItems = [...$currentCoreFunctions];
	});

	const updateCoreFunctionPositions = async (items: CoreFunction[]) => {
		try {
			const response = await fetch('/api/core_function', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(items)
			});
			if (!response.ok) {
				throw new Error('Failed to update positions');
			}

			$currentCoreFunctions = items;
			return; // Return void to match the type
		} catch (error) {
			console.error('Error updating positions:', error);
			throw error;
		}
	};

	function toggleExpand() {
		isExpanded = !isExpanded;
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
			<h2 class="text-base font-bold md:text-xl">CORE FUNCTIONS</h2>
		</div>
		<div class="flex items-center gap-5">
			{#if $ipcr?.id}
				{#if $canEdit}
					<SubmitIpcrAction ipcrId={$ipcr.id} {submitIPCRForm} />
					<CoreFunctionCreateDialog ipcrId={$ipcr.id} />
				{/if}
			{/if}
		</div>
	</header>
</div>

{#if isExpanded}
	{#snippet subCoreFunction(coreFunction: Tables<'core_function'>)}
		<SubCoreFunction {coreFunction} />
	{/snippet}
	<div class="relative space-y-4 px-4 pt-4 md:pl-14 md:pr-10">
		<DndContainer
			bind:items={dndItems}
			{isLoading}
			onPositionsUpdate={updateCoreFunctionPositions}
			emptyMessage="No Core functions found"
			successMessage="Updated Core Function Position"
			errorMessage="Failed to update core function order. Please try again."
		>
			{#each dndItems as coreFunction (coreFunction.id)}
				{@render subCoreFunction(coreFunction)}
			{/each}
		</DndContainer>
	</div>
{/if}
