<script lang="ts">
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { getOpHeaderStore } from '../states/op_header_state';
	import OperationalHeader from './OperationalHeader.svelte';

	//stores
	const { currentOpHeaders } = getOpHeaderStore();

	//states
	let dndItems = $state<Tables<'op_header'>[]>([]);

	$effect(() => {
		dndItems = $currentOpHeaders;
	});

	const updateOpHeaderPosition = async (items: Tables<'op_header'>[]): Promise<void> => {
		const response = await fetch('/api/op_header', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(items)
		});

		if (!response.ok) {
			throw new Error('Failed to update positions');
		}

		$currentOpHeaders = items;
	};
</script>

<DndContainer
	bind:items={dndItems}
	onPositionsUpdate={updateOpHeaderPosition}
	emptyMessage="No Operational Plan Headers"
	successMessage="Successfully Updated Operational Header Position"
	errorMessage="Failed to Update Operational Header Order. Please try again"
>
	{#each dndItems as opHeader (opHeader.id)}
		<div class="mt-2">
			<OperationalHeader {opHeader} />
		</div>
	{/each}
</DndContainer>
