<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import type { PageData } from './$types';
	import { getIPCRStore } from './(data)/state.svelte';
	import { createColumns } from './(table)/columns';
	import CreateDialogIpcr from './(table)/create-dialog-ipcr.svelte';

	let { data }: { data: PageData } = $props();
	const { currentUserIPCR } = getIPCRStore();
	const { createIPCRForm, deleteIPCRForm } = data.form;
	const columns = createColumns(deleteIPCRForm);
</script>

<DataTable
	filterPlaceholder={'Search by name...'}
	filterColumn={'title'}
	{columns}
	data={$currentUserIPCR}
>
	<CreateDialogIpcr data={createIPCRForm} />
</DataTable>
