<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronDown } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import type { Tables } from '$lib/types/database.types';
	import { slide } from 'svelte/transition';
	import { getSupervisorStore } from '../states/supervisor_id_state';
	import {
		fetchCategoriesBySupervisor,
		fetchDirectIndicatorsBySupervisor
	} from '../utils/page-helper-loader';
	import { showErrorToast } from '$lib/utils/toast';
	import Indicator from './indicator.svelte';
	import Category from './category.svelte';

	//props
	interface Iprops {
		ipcrFunction: Tables<'ipcr_function'>;
	}
	let { ipcrFunction }: Iprops = $props();

	//stores
	const { supervisorId } = getSupervisorStore();

	type ContentItems =
		| (Tables<'ipcr_function_category'> & { itemType: 'category' })
		| (Tables<'ipcr_indicator'> & { itemType: 'indicator' });

	let contentItems: ContentItems[] = $state([]);
	let isLoading = $state(false);
	let isExpanded = $state(false);

	// Separate fetch function
	async function fetchData() {
		isLoading = true;

		try {
			const [ipcrFunctionResult, ipcrIndicatorResult] = await Promise.all([
				fetchCategoriesBySupervisor(ipcrFunction.id, $supervisorId!),
				fetchDirectIndicatorsBySupervisor(ipcrFunction.id, $supervisorId!)
			]);

			//add type discriminator
			const functionItems = ipcrFunctionResult.map((item) => ({
				...item,
				itemType: 'category' as const
			}));

			const indicatorItems = ipcrIndicatorResult.map((item) => ({
				...item,
				itemType: 'indicator' as const
			}));

			contentItems = [...functionItems, ...indicatorItems].sort((a, b) => a.position - b.position);
		} catch (error) {
			console.error('Error fetching data:', error);
			showErrorToast('Failed to load data');
		} finally {
			isLoading = false;
		}
	}

	// Simplified toggle function
	async function toggleExpand() {
		isExpanded = !isExpanded;

		if (isExpanded && contentItems.length === 0) {
			await fetchData();
		}
	}
</script>

<div class="w-full">
	<header class="sticky top-0 flex h-10 items-center justify-between border-b px-4 md:px-10">
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
	</header>

	{#if isExpanded}
		<div class="p-4" transition:slide={{ duration: 300 }}>
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
							{#if item.itemType === 'category'}
								<Category ipcrFunctionCategory={item} />
							{:else}
								<Indicator ipcrIndicator={item} />
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
