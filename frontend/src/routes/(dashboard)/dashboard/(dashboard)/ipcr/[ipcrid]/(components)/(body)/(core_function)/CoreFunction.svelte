<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronDown, Plus } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import CoreFunctionCreateDialog from './(subcomponents)/(create_dialogs)/CoreFunctionCreateDialog.svelte';
	import SubCoreFunction from './SubCoreFunction.svelte';
	import { getCoreFunctionStore } from '../../(data)/corefunctionstate.svelte';

	const { currentCoreFunctions } = getCoreFunctionStore();
	let isExpanded = $state(false);

	function toggleExpand() {
		isExpanded = !isExpanded;
	}

	let { currentIpcrId }: { currentIpcrId: string } = $props();
</script>

<!-- Header -->
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
		<CoreFunctionCreateDialog ipcrId={currentIpcrId} />
	</header>
</div>
<!-- Sub Core Functions Teaching effectiveness etc... -->
{#if isExpanded}
	<div class="space-y-4 px-4 pt-4 md:pl-14 md:pr-10">
		{#if $currentCoreFunctions.length === 0}
			<h1>No Core functions found</h1>
		{:else}
			{#each $currentCoreFunctions as coreFunction}
				<SubCoreFunction
					name={coreFunction.name}
					units={coreFunction.unit}
					coreFunctionId={coreFunction.id}
				/>
			{/each}
		{/if}
	</div>
{/if}
