<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Search, X } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	interface Iprops {
		items: string[];
		name: string;
		placeholder: string;
		text: string;
	}
	// Props with items array
	let { items, name, placeholder, text = $bindable() }: Iprops = $props();

	// Control dropdown visibility
	let isOpen: boolean = $state(false);

	// Filtered items based on search query
	const filteredItems = $derived(
		items.filter((item) => item.toLowerCase().includes(text.toLowerCase()))
	);

	/** Clear search input */
	const clearSearch = () => {
		text = '';
		isOpen = false;
	};

	/** Select item from dropdown */
	const selectItem = (item: string) => {
		text = item;
		isOpen = false;
	};
</script>

<div class="relative">
	<div class="relative">
		<Input
			type="text"
			{name}
			{placeholder}
			bind:value={text}
			onfocus={() => (isOpen = true)}
			class="pr-10"
		/>

		<!-- Search or clear button -->
		<div class="absolute right-2 top-1/2 -translate-y-1/2">
			{#if text}
				<Button variant="ghost" size="icon" class="h-6 w-6" onclick={clearSearch}>
					<X class="h-4 w-4" />
				</Button>
			{:else}
				<Search class="text-muted-foreground h-4 w-4" />
			{/if}
		</div>
	</div>

	<!-- Results dropdown -->
	{#if isOpen && text.length > 0}
		<div
			class="bg-card absolute top-full z-50 mt-1 w-full rounded-md border shadow-md"
			transition:fade={{ duration: 100 }}
		>
			{#if filteredItems.length > 0}
				<ul class="max-h-60 overflow-auto py-1">
					{#each filteredItems as item}
						<li>
							<button
								class={cn(
									'hover:bg-accent w-full px-3 py-2 text-left text-sm',
									'focus:bg-accent focus:outline-none'
								)}
								onclick={(e) => {
									e.preventDefault();
									selectItem(item);
								}}
							>
								{item}
							</button>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-muted-foreground p-3 text-sm">No results found.</p>
			{/if}
		</div>
	{/if}
</div>
