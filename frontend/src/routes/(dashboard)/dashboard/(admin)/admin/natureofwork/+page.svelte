<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { createColumns } from './(table)/column';
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import CreateDialogNow from './(table)/create-dialog-now.svelte';

	let { data }: { data: PageData } = $props();
	const {
		form: { createNowForm, deleteNowForm, updateNowForm }
	} = data;

	let natureOfWorks = $derived(data.natureOfWork);

	const columns = createColumns(updateNowForm, deleteNowForm);
</script>

<DataTable filterPlaceholder="Search by type..." filterColumn="type" data={natureOfWorks} {columns}>
	<CreateDialogNow data={createNowForm} />
</DataTable>
