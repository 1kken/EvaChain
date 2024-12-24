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

	let { items, name, placeholder, text = $bindable() }: Iprops = $props();

	// Control dropdown visibility and active search
	let isOpen = $state(false);
	let isActiveSearch = $state(false);
	let showNoResults = $state(false);
	let isVisible = $state(true);
	let dropdownRef: HTMLDivElement;

	// Timer for no results message
	let noResultsTimer: ReturnType<typeof setTimeout>;

	// Filtered items based on search query
	const filteredItems = $derived(
		items.filter((item) => item.toLowerCase().includes(text.toLowerCase()))
	);

	$effect(() => {
		if (noResultsTimer) {
			clearTimeout(noResultsTimer);
		}

		if (filteredItems.length === 0 && isActiveSearch && text.length > 0) {
			showNoResults = true;
			noResultsTimer = setTimeout(() => {
				showNoResults = false;
				isOpen = false;
				isActiveSearch = false;
			}, 2000);
		} else {
			showNoResults = false;
		}
	});

	// Add event listener to close dropdown on form submit
	$effect(() => {
		const handleSubmit = () => {
			isOpen = false;
			isActiveSearch = false;
			showNoResults = false;
		};

		window.addEventListener('submit', handleSubmit, true);
		return () => window.removeEventListener('submit', handleSubmit, true);
	});

	/** Clear search input */
	const clearSearch = () => {
		isVisible = false;
		text = '';
		isOpen = false;
		isActiveSearch = false;
		showNoResults = false;
		if (noResultsTimer) clearTimeout(noResultsTimer);

		setTimeout(() => {
			isVisible = true;
		}, 1);
	};

	/** Select item from dropdown */
	const selectItem = (item: string) => {
		text = item;
		isOpen = false;
		isActiveSearch = false;
		showNoResults = false;
		if (noResultsTimer) clearTimeout(noResultsTimer);
	};

	/** Handle input changes */
	const handleInput = () => {
		if (!isActiveSearch) {
			isActiveSearch = true;
		}
		isOpen = text.length > 0;
	};

	/** Handle input focus */
	const handleFocus = (e: FocusEvent) => {
		// Only open dropdown if user is actively focusing the input
		if (e.relatedTarget === null) {
			isActiveSearch = true;
			isOpen = text.length > 0;
		}
	};

	/**remove auto focus*/
	let inputRef: HTMLInputElement | null = $state(null);
</script>

<div class="relative" bind:this={dropdownRef}>
	{#if isVisible}
		<div class="relative">
			<Input
				type="text"
				{name}
				{placeholder}
				bind:value={text}
				oninput={handleInput}
				onfocus={handleFocus}
				class="pr-10"
			/>

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

		{#if isOpen && isActiveSearch}
			<div
				class="bg-background absolute top-full z-[100] mt-1 w-full rounded-md border shadow-md"
				transition:fade={{ duration: 100 }}
			>
				{#if filteredItems.length > 0}
					<ul class="max-h-60 overflow-auto py-1">
						{#each filteredItems as item}
							<li>
								<button
									type="button"
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
				{:else if showNoResults}
					<div class="bg-background w-full">
						<p class="text-muted-foreground p-3 text-sm">No results found.</p>
					</div>
				{/if}
			</div>
		{/if}
	{/if}
</div>
