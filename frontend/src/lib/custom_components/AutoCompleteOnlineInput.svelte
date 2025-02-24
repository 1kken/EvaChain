<!-- SearchComponent.svelte -->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Search, X } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { onMount } from 'svelte';

	interface SearchResult {
		id: string; // UUID or any unique identifier
		display: string; // Text to show in input (e.g., name)
		[key: string]: any; // For additional fields
	}

	interface Props {
		name: string;
		placeholder: string;
		onSearch: (query: string) => Promise<SearchResult[]>;
		onSelect?: (result: SearchResult) => void;
		onFetchById?: (id: string) => Promise<SearchResult>;
		selectedId?: string | null;
		displayText?: string;
		debounceMs?: number;
		minSearchLength?: number;
		disabled?: boolean;
	}

	let {
		name,
		placeholder,
		onSearch,
		onSelect,
		onFetchById,
		debounceMs = 300,
		minSearchLength = 2,
		selectedId = $bindable(''),
		displayText = $bindable(''),
		disabled
	}: Props = $props();

	// Effect to handle initial data loading when selectedId is present
	onMount(async () => {
		if (selectedId && onFetchById && !displayText) {
			try {
				const result = await onFetchById(selectedId);
				if (result) {
					displayText = result.display;
				}
			} catch (error) {
				console.error('Error fetching initial data:', error);
			}
		}
	});

	let isOpen = $state(false);
	let isLoading = $state(false);
	let searchResults = $state<SearchResult[]>([]);
	let showNoResults = $state(false);
	let isVisible = $state(true);
	let dropdownRef: HTMLDivElement;

	let searchTimeout: ReturnType<typeof setTimeout>;

	const handleSearch = async () => {
		if (displayText.length < minSearchLength) {
			searchResults = [];
			isOpen = false;
			return;
		}

		isLoading = true;

		try {
			const results = await onSearch(displayText);
			searchResults = results;
			isOpen = true;
			showNoResults = results.length === 0;
		} catch (error) {
			console.error('Search failed:', error);
			searchResults = [];
			showNoResults = true;
		} finally {
			isLoading = false;
		}
	};

	// Cleanup effect for timeouts
	$effect(() => {
		return () => {
			if (searchTimeout) {
				clearTimeout(searchTimeout);
			}
		};
	});

	const clearSearch = () => {
		isVisible = false;
		displayText = '';
		selectedId = '';
		searchResults = [];
		isOpen = false;
		showNoResults = false;

		setTimeout(() => {
			isVisible = true;
		}, 1);
	};

	const selectItem = (result: SearchResult) => {
		displayText = result.display;
		selectedId = result.id;
		isOpen = false;
		searchResults = [];
		showNoResults = false;

		if (onSelect) {
			onSelect(result);
		}
	};

	$effect(() => {
		const handleSubmit = () => {
			isOpen = false;
			showNoResults = false;
		};

		window.addEventListener('submit', handleSubmit, true);
		return () => window.removeEventListener('submit', handleSubmit, true);
	});
</script>

<div class="relative" bind:this={dropdownRef}>
	{#if isVisible}
		<div class="relative">
			<!-- Hidden input for the actual value (UUID) -->
			<input type="hidden" {name} value={selectedId} />

			<Input
				{disabled}
				type="text"
				name={`${name}_display`}
				{placeholder}
				bind:value={displayText}
				oninput={async (e) => {
					const value = e.currentTarget.value;
					displayText = value;

					// Clear any pending search
					if (searchTimeout) {
						clearTimeout(searchTimeout);
					}

					if (value.length >= minSearchLength) {
						isLoading = true;
						searchTimeout = setTimeout(async () => {
							try {
								const results = await onSearch(value);
								searchResults = results;
								isOpen = results.length > 0;
								showNoResults = results.length === 0;
							} catch (error) {
								console.error('Search failed:', error);
								searchResults = [];
								showNoResults = true;
							} finally {
								isLoading = false;
							}
						}, debounceMs);
					} else {
						searchResults = [];
						isOpen = false;
						isLoading = false;
						showNoResults = false;
					}
				}}
				class="pr-10"
				autocomplete="off"
			/>

			<div class="absolute right-2 top-1/2 -translate-y-1/2">
				{#if displayText}
					<Button variant="ghost" size="icon" class="h-6 w-6" onclick={clearSearch} {disabled}>
						<X class={cn('h-4 w-4', disabled && 'opacity-50')} />
					</Button>
				{:else}
					<Search
						class={cn(
							'text-muted-foreground h-4 w-4',
							isLoading && 'animate-spin',
							disabled && 'opacity-50'
						)}
					/>
				{/if}
			</div>
		</div>

		{#if isOpen && searchResults.length > 0}
			<div
				class="bg-background absolute top-full z-[100] mt-1 w-full rounded-md border shadow-md"
				transition:fade={{ duration: 100 }}
			>
				<ul class="max-h-60 overflow-auto py-1">
					{#each searchResults as result}
						<li>
							<button
								type="button"
								class="hover:bg-accent focus:bg-accent w-full px-3 py-2 text-left text-sm focus:outline-none"
								onclick={(e) => {
									e.preventDefault();
									selectItem(result);
								}}
							>
								{result.display}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		{#if showNoResults}
			<div
				class="bg-background absolute top-full z-[100] mt-1 w-full rounded-md border shadow-md"
				transition:fade={{ duration: 100 }}
			>
				<p class="text-muted-foreground p-3 text-sm">No results found.</p>
			</div>
		{/if}
	{/if}
</div>
