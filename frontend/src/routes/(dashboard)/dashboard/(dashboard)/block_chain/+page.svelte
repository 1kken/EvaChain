<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import {
		mapToOptions,
		type PropDataFacet,
		type PropOptionFacet
	} from '$lib/custom_components/data-table/helper';
	import type { PageData } from './$types';
	import { createColumns } from './(table)/columns';
	import TableSkeleton from '$lib/custom_components/TableSkeleton.svelte';
	let { data }: { data: PageData } = $props();
	const columns = createColumns();
	let fileTypeOptions: PropOptionFacet[] = mapToOptions(
		[
			{ name: 'Data/CSV Type', value: 'data' },
			{ name: 'PDF/Evidence Type', value: 'evidence' }
		],
		'value',
		'name'
	);

	let actionTypeOptions: PropOptionFacet[] = mapToOptions(
		[
			{ name: 'Add', value: 'add' },
			{ name: 'Update', value: 'update' },
			{ name: 'Delete', value: 'delete' },
			{ name: 'Backup', value: 'backup' }
		],
		'value',
		'name'
	);
	const propDataFacet: PropDataFacet[] = [
		{ column: 'type', options: fileTypeOptions },
		{ column: 'action', options: actionTypeOptions }
	];
</script>

{#await data.streamed.blockChainData}
	<TableSkeleton />
{:then blockChainData}
	{#if blockChainData.length === 0}
		<p>No data available</p>
	{:else}
		<DataTable
			filterPlaceholder={'Search by File Name...'}
			filterColumn={'file_name'}
			{columns}
			data={blockChainData}
			filterDataFacet={propDataFacet}
		/>
	{/if}
{:catch error}
	<p>{error.message}</p>
{/await}
