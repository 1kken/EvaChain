<!-- DndContainer.svelte -->
<script lang="ts">
	import { LoaderCircle } from 'lucide-svelte';
	import { dndzone } from 'svelte-dnd-action';
	import type { DndEvent } from 'svelte-dnd-action';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import type { Snippet } from 'svelte';

	interface Props<T> {
		children: Snippet<[]>;
		items: T[];
		onPositionsUpdate: (items: T[]) => Promise<void>;
		isLoading?: boolean;
		emptyMessage?: string;
		successMessage?: string;
		errorMessage?: string;
	}

	let {
		children,
		items = $bindable(),
		onPositionsUpdate,
		isLoading = false,
		emptyMessage = 'No items found',
		successMessage = 'Updated positions successfully',
		errorMessage = 'Failed to update order. Please try again.'
	}: Props<any> = $props();

	let isUpdating = $state(false);
	const flipDurationMs = 300;

	function handleDndConsider(e: CustomEvent<DndEvent<any>>) {
		const updatedItems = e.detail.items.map((item, index) => ({
			...item,
			position: (index + 1) * 100
		}));
		items = updatedItems; // Update the items directly like in original code
	}

	async function handleDndFinalize(e: CustomEvent<DndEvent<any>>) {
		try {
			isUpdating = true;
			const updatedItems = e.detail.items.map((item, index) => ({
				...item,
				position: (index + 1) * 100
			}));

			await onPositionsUpdate(updatedItems);
			showSuccessToast(successMessage);
		} catch (error) {
			console.error('Failed to update positions:', error);
			showErrorToast(errorMessage);
			items = [...items]; // Reset to original items
		} finally {
			isUpdating = false;
		}
	}
</script>

{#if isLoading}
	<div class="flex justify-center py-4">
		<LoaderCircle class="h-6 w-6 animate-spin" />
	</div>
{:else if items?.length > 0}
	<div
		use:dndzone={{
			items,
			flipDurationMs,
			dropFromOthersDisabled: true,
			dropTargetStyle: { outline: `rgba(102, 204, 255, 0.7) solid 2px` }
		}}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
		class="relative space-y-4"
	>
		{#if isUpdating}
			<div class="absolute right-2 top-2">
				<LoaderCircle class="h-4 w-4 animate-spin" />
			</div>
		{/if}
		{@render children()}
	</div>
{:else}
	<div class="text-center text-gray-500">{emptyMessage}</div>
{/if}
