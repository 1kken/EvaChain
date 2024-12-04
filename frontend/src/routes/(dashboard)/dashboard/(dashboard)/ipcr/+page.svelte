<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import type { PageData } from './$types';
	import { getIPCRStore } from './(data)/state.svelte';
	import { createColumns } from './(table)/columns';
	import CreateButtonIpcrTeaching from './(table)/create-button-ipcr-teaching.svelte';

	let { data }: { data: PageData } = $props();
	const { createIPCRForm, deleteIPCRForm } = data.form;
	const { currentUserIPCR } = getIPCRStore();
	const columns = createColumns(deleteIPCRForm);
</script>

<DataTable
	filterPlaceholder={'Search by name...'}
	filterColumn={'title'}
	{columns}
	data={$currentUserIPCR}
>
	<CreateButtonIpcrTeaching data={createIPCRForm} />
</DataTable>
