<script lang="ts">
	import { ChevronDown, Plus } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import SubCoreFunctionIndicatorCreateDialog from './(subcomponents)/(create_dialogs)/SubCoreFunctionIndicatorCreateDialog.svelte';

	// Props
	let { name }: { name: string } = $props();

	// States
	let isExpanded: boolean = $state(false);
	let targets: number[] = $state([0]); // Initialize with one target

	/** Toggle expansion */
	const toggleExpand = () => {
		isExpanded = !isExpanded;
	};
</script>

<div class="rounded-lg border">
	<div class="flex min-h-[3.5rem] items-center justify-between p-3">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" class="hidden md:flex" onclick={toggleExpand}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<h4 class="font-medium">{name}</h4>
		</div>
		<SubCoreFunctionIndicatorCreateDialog />
	</div>

	{#if isExpanded}
		<div class="border-t p-3">
			{#each targets as index}
				{index}
			{/each}
		</div>
	{/if}
</div>
