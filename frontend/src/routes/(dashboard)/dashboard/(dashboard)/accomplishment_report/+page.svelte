<script lang="ts">
	import type { PageData } from './$types';
	import { setAccomplishmentReportStore } from './(data)/accomp_state';
	import { createColumns } from './(table)/columns';
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import Create from './(table)/Create.svelte';

	//props
	let { data }: { data: PageData } = $props();
	const { createForm, deleteForm, updateForm } = data.accReportForm;

	//state
	let isAddDrawerOpen = $state(false);
	//store
	const { currentUserAccomplishmentReport } = setAccomplishmentReportStore(data.accReport);

	//columns
	const columns = createColumns(deleteForm, updateForm);
</script>

<DataTable
	{columns}
	data={$currentUserAccomplishmentReport}
	filterPlaceholder={'Search by title'}
	filterColumn={'title'}
>
	<Create bind:isAddDrawerOpen data={createForm} />
</DataTable>
