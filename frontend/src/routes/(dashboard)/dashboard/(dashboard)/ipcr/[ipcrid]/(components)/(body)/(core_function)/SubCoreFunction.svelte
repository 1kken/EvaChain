<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/utils';
	import { ChevronDown, Plus } from 'lucide-svelte';
	import SubCoreFunctionCreateDialog from './(subcomponents)/(create_dialogs)/SubCoreFunctionCreateDialog.svelte';
	import CoreFunctionIndicator from './CoreFunctionIndicator.svelte';
	import DeleteActionCoreFunction from './(subcomponents)/(delete_actions)/DeleteActionCoreFunction.svelte';
	import DropDownWrapper from './(subcomponents)/DropDownWrapper.svelte';
	import CoreFunctionUpdateDialog from './(subcomponents)/(update_dialogs)/CoreFunctionUpdateDialog.svelte';
	import CoreFunctionCreateDialog from './(subcomponents)/(create_dialogs)/CoreFunctionCreateDialog.svelte';

	// Props
	let { name, units, coreFunctionId }: { name: string; units: number; coreFunctionId: string } =
		$props();

	let isExpanded: boolean = $state(false);
	let subFunctions: string[] = $state(['Instructional Imperatives']);

	const toggleExpand = () => {
		isExpanded = !isExpanded;
	};
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
				<h3 class="text-sm font-semibold md:text-base">{name}</h3>
				<p class="text-muted-foreground text-xs md:text-sm">({units} units)</p>
			</div>
		</div>
		{#snippet deleteAction()}
			<DeleteActionCoreFunction id={coreFunctionId} />
		{/snippet}
		{#snippet updateDialog()}
			<CoreFunctionUpdateDialog {coreFunctionId} />
		{/snippet}
		<div class="flex gap-4">
			<SubCoreFunctionCreateDialog />
			<DropDownWrapper {deleteAction} {updateDialog} />
		</div>
	</div>

	{#if isExpanded}
		<div class="border-t p-4">
			<div class="space-y-4">
				{#each subFunctions as subFunction}
					<CoreFunctionIndicator name={subFunction} />
				{/each}
			</div>
		</div>
	{/if}
</div>
