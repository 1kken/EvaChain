<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { createColumns } from './(table)/column';
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import CreateDialogEps from './(table)/create-dialog-eps.svelte';

	let { data }: { data: PageData } = $props();
	const {
		form: { createEpsForm, deleteEpsForm, updateEpsForm }
	} = data;

	let employeeStatus = $derived(data.employeeStatus);

	const columns = createColumns(updateEpsForm, deleteEpsForm);
</script>

<DataTable
	filterPlaceholder="Search by type..."
	filterColumn="type"
	data={employeeStatus}
	{columns}
>
	<CreateDialogEps data={createEpsForm} />
</DataTable>
