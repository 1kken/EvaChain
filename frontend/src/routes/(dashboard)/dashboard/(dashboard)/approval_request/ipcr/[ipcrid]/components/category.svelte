<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { Tables } from '$lib/types/database.types';
	import { cn } from '$lib/utils';
	import { ChevronDown } from 'lucide-svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import {
		fetchIpcrFunctionIndicators,
		fetchIpcrFunctionSubCategories
	} from '../utils/page-helper-loader';
	import { showErrorToast } from '$lib/utils/toast';
	import { slide } from 'svelte/transition';
	import Indicator from './indicator.svelte';
	import SubCategory from './sub-category.svelte';

	//props
	interface Iprops {
		ipcrFunctionCategory: Tables<'ipcr_function_category'>;
	}
	let { ipcrFunctionCategory }: Iprops = $props();

	//states
	type ContentItems =
		| (Tables<'ipcr_function_sub_category'> & { itemType: 'sub_category' })
		| (Tables<'ipcr_indicator'> & { itemType: 'indicator' });
	let isLoading = $state(false);
	let isExpanded = $state(false);
	let contentItems: ContentItems[] = $state([]);

	// API BASED
	async function fetchData() {
		isLoading = true;

		try {
			const [ipcrSubCategoryResult, ipcrIndicatorResult] = await Promise.all([
				fetchIpcrFunctionSubCategories(ipcrFunctionCategory.id),
				fetchIpcrFunctionIndicators('ipcr_category_id', ipcrFunctionCategory.id)
			]);

			const subCategoryItems = ipcrSubCategoryResult.map((item) => ({
				...item,
				itemType: 'sub_category' as const
			}));
			const indicatorItems = ipcrIndicatorResult.map((item) => ({
				...item,
				itemType: 'indicator' as const
			}));
			contentItems = [...subCategoryItems, ...indicatorItems].sort(
				(a, b) => a.position - b.position
			);
		} catch (error) {
			console.error('Error fetching data:', error);
			showErrorToast('Failed to load data');
		} finally {
			isLoading = false;
		}
	}

	// Clean toggle function
	async function toggleExpand() {
		isExpanded = !isExpanded;

		if (isExpanded && contentItems.length === 0) {
			await fetchData();
		}
	}
</script>

<div class="rounded-lg border">
	<div class="flex h-10 items-center justify-between p-4">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" onclick={toggleExpand}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<div class="flex items-center gap-2">
				<Badge variant={'secondary'} class="h-5 bg-teal-500 text-xs">Category</Badge>
				<h1 class="text-sm">{ipcrFunctionCategory.category}</h1>
				<p class="text-xs text-gray-500">{ipcrFunctionCategory.unit ?? '_'} units</p>
			</div>
		</div>
	</div>

	{#if isExpanded}
		<div class="p-4" transition:slide={{ duration: 300 }}>
			<div class="border-t p-4" transition:slide={{ duration: 300 }}>
				{#if isLoading}
					<div class="flex justify-center py-4">
						<div class="loader">Loading...</div>
					</div>
				{:else if contentItems.length === 0}
					<div class="py-4 text-center text-gray-500">No items found</div>
				{:else}
					<div class="space-y-2">
						{#each contentItems as item (item.id)}
							<div class="py-2">
								{#if item.itemType === 'sub_category'}
									<SubCategory ipcrSubCategory={item} />
								{:else}
									<Indicator ipcrFunctionIndicator={item} />
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
