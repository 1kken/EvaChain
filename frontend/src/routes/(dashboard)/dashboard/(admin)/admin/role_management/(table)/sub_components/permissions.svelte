<script lang="ts">
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { ChevronDownIcon, ChevronUpIcon } from 'lucide-svelte';
	import {
		Collapsible,
		CollapsibleContent,
		CollapsibleTrigger
	} from '$lib/components/ui/collapsible';
	import type { Module } from '..';
	import { slide } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';

	type Props = {
		module: Module;
		isExpanded: boolean;
		selectedPermissionIds: number[];
		onToggleExpand: () => void;
	};

	const dispatch = createEventDispatcher();
	let { module, isExpanded, onToggleExpand, selectedPermissionIds }: Props = $props();

	// Handle select all permissions for module
	const handleSelectAll = (checked: boolean) => {
		module.permissions.forEach((permission) => {
			permission.checked = checked;
		});
	};

	// Available scope options
	const scopeOptions = ['All', 'Unit', 'Office', 'Program'];

	// Compute if all permissions are checked
	const allChecked = $derived(module.permissions.every((permission) => permission.checked));

	// Compute if some permissions are checked
	const someChecked = $derived(module.permissions.some((permission) => permission.checked));
</script>

<Card>
	<Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
		<CardHeader class="p-4">
			<CollapsibleTrigger class="flex w-full items-center space-x-4">
				<div class="flex flex-1 items-center gap-4">
					<button
						type="button"
						onclick={(e) => {
							e.stopPropagation();
							handleSelectAll(!allChecked);
						}}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								handleSelectAll(!allChecked);
							}
						}}
						aria-pressed={allChecked}
					>
						<Checkbox checked={allChecked} data-state={someChecked ? 'indeterminate' : undefined} />
					</button>
					<span class="text-sm font-medium">{module.name}</span>
				</div>

				<!-- {#if module.scope}
					<div class="flex items-center">
						<Select type="single" bind:value={module.scope}>
							<SelectTrigger class="w-[120px]" onclick={(e) => e.stopPropagation()}>
								<span class="truncate">{module.scope}</span>
							</SelectTrigger>
							<SelectContent>
								{#each scopeOptions as scope}
									<SelectItem value={scope}>{scope}</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					</div>
				{/if} -->

				<div class="ml-2 flex h-4 w-4 items-center justify-center">
					{#if isExpanded}
						<ChevronUpIcon class="h-4 w-4 transition-transform duration-200" />
					{:else}
						<ChevronDownIcon class="h-4 w-4 transition-transform duration-200" />
					{/if}
				</div>
			</CollapsibleTrigger>
		</CardHeader>

		<CollapsibleContent forceMount>
			{#snippet child({ props, open })}
				{#if open}
					<div {...props} transition:slide={{ duration: 200 }}>
						<CardContent class="pt-0">
							<div class="grid gap-4 sm:grid-cols-2">
								{#each module.permissions as permission (permission.id)}
									<div class="flex items-center gap-2">
										<Checkbox
											id={`permission-${permission.id}`}
											onCheckedChange={(checked) => {
												const newIds = checked
													? [...selectedPermissionIds, permission.id]
													: selectedPermissionIds.filter((id) => id !== permission.id);
												dispatch('updatePermissions', newIds);
											}}
										/>
										<label for={`permission-${permission.id}`} class="text-sm">
											{permission.name}
										</label>
									</div>
								{/each}
							</div>
						</CardContent>
					</div>
				{/if}
			{/snippet}
		</CollapsibleContent>
	</Collapsible>
</Card>
