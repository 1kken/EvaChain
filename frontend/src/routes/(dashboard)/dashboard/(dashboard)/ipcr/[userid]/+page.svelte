<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import type { PageData } from './$types';
	import { getIPCRStore } from './(data)/state.svelte';
	import { createColumns } from './(table)/columns';

	let { data }: { data: PageData } = $props();

	const { currentUserIPCR } = getIPCRStore();
	const columns = createColumns();
</script>

<DataTable
	filterPlaceholder={'Search by name'}
	filterColumn={'title'}
	{columns}
	data={$currentUserIPCR}
/>
