<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import type { PageData } from './$types';
	import { createColumns } from './(table)/columns';

	let { data }: { data: PageData } = $props();
	const { uuidForm, revisionForm } = data.actionForms;
	let columns = createColumns(uuidForm, revisionForm);
	let ipcrs = $derived(data.ipcrs);
</script>

<DataTable
	filterPlaceholder="Search by title..."
	filterColumn="ipcr_title"
	{columns}
	data={ipcrs}
/>
