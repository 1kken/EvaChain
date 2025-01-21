<script lang="ts">
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { getAccomplishmentHeaderStore } from '../states/header_state';
	import Header from './Header.svelte';

	//stores
	const { currentAccomplishmentHeaders } = getAccomplishmentHeaderStore();

	//states
	let dndItems = $state<Tables<'accomplishment_header'>[]>([]);

	$effect(() => {
		dndItems = $currentAccomplishmentHeaders;
	});

	const updateAccHeaderPosition = async (
		items: Tables<'accomplishment_header'>[]
	): Promise<void> => {
		const response = await fetch('/api/accomplishment_report/header', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(items)
		});
		if (!response.ok) {
			throw new Error('Failed to update positions');
		}
		$currentAccomplishmentHeaders = items;
	};
</script>

<DndContainer
	bind:items={dndItems}
	onPositionsUpdate={updateAccHeaderPosition}
	emptyMessage="No Accomplishment Header Found"
	successMessage="Successfully Header Order"
	errorMessage="Failed to Update Header Order"
>
	{#each dndItems as accHeader (accHeader.id)}
		<div class="mt-2">
			<Header {accHeader} />
		</div>
	{/each}
</DndContainer>
