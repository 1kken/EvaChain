<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import {
		mapToOptions,
		type PropDataFacet,
		type PropOptionFacet
	} from '$lib/custom_components/data-table/helper';
	import type { PageData } from './$types';
	import { createColumns } from './(table)/columns';

	let { data }: { data: PageData } = $props();
	let blockChainData = $derived(data.blockChainData);
	const columns = createColumns();
	let fileTypeOptions: PropOptionFacet[] = mapToOptions(
		[
			{ name: 'Data/CSV Type', value: 'data' },
			{ name: 'PDF/Evidence Type', value: 'evidence' }
		],
		'value', //value to search
		'name' //display
	);

	let actionTypeOptions: PropOptionFacet[] = mapToOptions(
		[
			{ name: 'Add', value: 'add' },
			{ name: 'Update', value: 'update' },
			{ name: 'Delete', value: 'delete' },
			{ name: 'Backup', value: 'backup' }
		],
		'value', //value to search
		'name' //display
	);
	const propDataFacet: PropDataFacet[] = [
		{ column: 'type', options: fileTypeOptions },
		{ column: 'action', options: actionTypeOptions }
	];
</script>

<DataTable
	filterPlaceholder={'Search by File Name...'}
	filterColumn={'file_name'}
	{columns}
	data={blockChainData}
	filterDataFacet={propDataFacet}
/>
