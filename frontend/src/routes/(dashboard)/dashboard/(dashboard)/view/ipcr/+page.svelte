<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import type { PageData } from './$types';
	import { createColumns } from './(table)/columns';

	let { data }: { data: PageData } = $props();
	let ipcr = $derived(data.ipcrs);
	const columns = createColumns();
</script>

<DataTable
	filterPlaceholder={'Search by employee_id...'}
	filterColumn={'employee_id'}
	{columns}
	data={ipcr}
/>
