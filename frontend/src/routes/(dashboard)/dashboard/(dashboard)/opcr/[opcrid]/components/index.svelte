<script lang="ts">
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { getOpcrFunctionStore } from '../states/function_state';
	import FunctionComponent from './functionComponent.svelte';

	//stores
	const { currentOpcrFunctions } = getOpcrFunctionStore();

	//states
	let dndItems = $state<Tables<'opcr_function'>[]>([]);

	$effect(() => {
		dndItems = $currentOpcrFunctions;
	});

	const updateFunctionPosition = async (items: Tables<'opcr_function'>[]): Promise<void> => {
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

		$currentOpcrFunctions = items;
	};
</script>

<DndContainer
	bind:items={dndItems}
	onPositionsUpdate={updateFunctionPosition}
	emptyMessage="No OPCR Functions Found"
	successMessage="Successfully Updated IPCR Functions order"
	errorMessage="Failed to Update IPCR Function Order. Please try again"
>
	{#each dndItems as opcrFunction (opcrFunction.id)}
		<div class="mt-2">
			<FunctionComponent {opcrFunction} />
		</div>
	{/each}
</DndContainer>
