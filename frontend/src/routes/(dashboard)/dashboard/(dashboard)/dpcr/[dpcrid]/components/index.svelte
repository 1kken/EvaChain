<script lang="ts">
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { getDpcrFunctionStore } from '../states/function_state';
	import FunctionComponent from './functionComponent.svelte';

	//stores
	const { currentDpcrFunctions } = getDpcrFunctionStore();

	//states
	let dndItems = $state<Tables<'dpcr_function'>[]>([]);

	$effect(() => {
		dndItems = $currentDpcrFunctions;
	});

	const updateOpHeaderPosition = async (items: Tables<'dpcr_function'>[]): Promise<void> => {
		const response = await fetch('/api/dpcr/function', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(items)
		});

		if (!response.ok) {
			throw new Error('Failed to update positions');
		}

		$currentDpcrFunctions = items;
	};
</script>

<DndContainer
	bind:items={dndItems}
	onPositionsUpdate={updateOpHeaderPosition}
	emptyMessage="No DPCR Functions Found"
	successMessage="Successfully Updated IPCR Functions order"
	errorMessage="Failed to Update IPCR Function Order. Please try again"
>
	{#each dndItems as dpcrFunction (dpcrFunction.id)}
		<div class="mt-2">
			<FunctionComponent {dpcrFunction} />
		</div>
	{/each}
</DndContainer>
