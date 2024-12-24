<script lang="ts">
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { getIpcrFunctionStore } from '../states/ipcr_function_state';
	import IpcrFunction from './IPCRFunction.svelte';

	//stores
	const { currentIpcrFunctions } = getIpcrFunctionStore();

	//states
	let dndItems = $state<Tables<'ipcr_function'>[]>([]);

	$effect(() => {
		dndItems = $currentIpcrFunctions;
	});

	const updateOpHeaderPosition = async (items: Tables<'ipcr_function'>[]): Promise<void> => {
		const response = await fetch('/api/ipcr_function', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(items)
		});

		if (!response.ok) {
			throw new Error('Failed to update positions');
		}

		$currentIpcrFunctions = items;
	};
</script>

<DndContainer
	bind:items={dndItems}
	onPositionsUpdate={updateOpHeaderPosition}
	emptyMessage="No IPCR Functions Found"
	successMessage="Successfully Updated IPCR Functions order"
	errorMessage="Failed to Update IPCR Function Order. Please try again"
>
	{#each dndItems as ipcrFunction (ipcrFunction.id)}
		<div class="mt-2">
			<IpcrFunction {ipcrFunction} />
		</div>
	{/each}
</DndContainer>
