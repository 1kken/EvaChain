<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { ChevronDown } from 'lucide-svelte';
	import type { Tables } from '$lib/types/database.types';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { fetchIpcrFunctionIndicators } from '../utils/page-helper-loader';
	import { showErrorToast } from '$lib/utils/toast';
	import Indicator from './indicator.svelte';

	interface Iprops {
		ipcrSubCategory: Tables<'ipcr_function_sub_category'>;
	}

	let { ipcrSubCategory }: Iprops = $props();

	// States
	let isExpanded = $state(false);
	let isLoading = $state(false);
	let contentItems = $state<Tables<'ipcr_indicator'>[]>([]);

	// Store initialization
	async function fetchIndicators(): Promise<void> {
		try {
			isLoading = true;
			const result = await fetchIpcrFunctionIndicators('ipcr_sub_category_id', ipcrSubCategory.id);

			contentItems = result;
		} catch (error) {
			console.error('Error fetching indicators:', error);
			showErrorToast('Failed to load indicators');
		} finally {
			isLoading = false;
		}
	}

	// UI Handlers
	async function toggleExpand() {
		isExpanded = !isExpanded;
		if (isExpanded && contentItems.length === 0) {
			await fetchIndicators();
		}
	}
</script>

<div class="rounded-lg border">
	<div class="flex h-10 items-center justify-between p-3">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" class="md:flex" onclick={toggleExpand}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<div class="flex items-center gap-2">
				<Badge variant={'secondary'} class="h-5 bg-green-400 text-xs">Sub-Category</Badge>
				<h1 class="text-sm">{ipcrSubCategory.sub_category}</h1>
			</div>
		</div>
	</div>

	{#if isExpanded}
		<div class="border-t p-3">
			{#if isLoading}
				<div class="flex justify-center py-4">
					<div class="loader">Loading...</div>
				</div>
			{:else if contentItems.length === 0}
				<div class="py-4 text-center text-gray-500">No Indicators Found</div>
			{:else}
				<div class="space-y-2">
					{#each contentItems as indicator (indicator.id)}
						<div class="py-1">
							<Indicator ipcrFunctionIndicator={indicator} />
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
