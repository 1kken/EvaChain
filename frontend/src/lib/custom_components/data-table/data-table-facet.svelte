<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { Check, PlusCircle, X } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import type { Column } from '@tanstack/table-core';
	import type { PropOptionFacet } from './helper';

	interface DataTableFacetedFilter {
		column?: Column<any, unknown>;
		title?: string;
		options: PropOptionFacet[];
	}

	let { column, title, options }: DataTableFacetedFilter = $props();

	let selectedValues = $state<string[]>([]);
	let open = $state(false);

	$effect(() => {
		if (column) {
			const filterValues = column?.getFilterValue() as string[];
			selectedValues = filterValues ?? [];
		}
	});

	function handleSelect(value: string) {
		if (selectedValues.includes(value)) {
			selectedValues = selectedValues.filter((v) => v !== value);
		} else {
			selectedValues = [...selectedValues, value];
		}
		column?.setFilterValue(selectedValues.length ? selectedValues : undefined);
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		<Button
			variant="outline"
			size="sm"
			class={cn('h-8 border-dashed', selectedValues?.length && 'border-solid')}
		>
			<PlusCircle class="mr-2 h-4 w-4" />
			{title}
			{#if selectedValues?.length > 0}
				<Separator orientation="vertical" class="mx-2 h-4" />
				<Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">
					{selectedValues.length}
				</Badge>
				<div class="hidden space-x-1 lg:flex">
					{#each selectedValues as value}
						<Badge variant="secondary" class="rounded-sm px-1 font-normal">
							{options.find((option) => option.value === value)?.label}
							<button
								class="ring-offset-background focus:ring-ring ml-1 rounded-sm outline-none focus:ring-2 focus:ring-offset-2"
								onkeydown={(e) => {
									if (e.key === 'Enter') {
										handleSelect(value);
									}
								}}
								onclick={(e) => {
									e.preventDefault();
									handleSelect(value);
								}}
							>
								<X class="h-3 w-3" />
							</button>
						</Badge>
					{/each}
				</div>
			{/if}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0" align="start">
		<Command.Root>
			<Command.Input placeholder={title} />
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>
				<Command.Group>
					{#each options as option (option.value)}
						<Command.Item onSelect={() => handleSelect(option.value)}>
							<div
								class={cn(
									'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
									selectedValues?.includes(option.value)
										? 'bg-primary text-primary-foreground'
										: 'opacity-50 [&_svg]:invisible'
								)}
							>
								<Check class={cn('h-4 w-4')} />
							</div>
							{#if option.icon}
								<option.icon class="text-muted-foreground mr-2 h-4 w-4" />
							{/if}
							<span>{option.label}</span>
							{#if selectedValues?.includes(option.value)}
								<span class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
									{selectedValues.indexOf(option.value) + 1}
								</span>
							{/if}
						</Command.Item>
					{/each}
				</Command.Group>
				{#if selectedValues?.length > 0}
					<Command.Separator />
					<Command.Group>
						<Command.Item
							class="justify-center text-center"
							onSelect={() => {
								selectedValues = [];
								column?.setFilterValue(undefined);
							}}
						>
							Clear filters
						</Command.Item>
					</Command.Group>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
