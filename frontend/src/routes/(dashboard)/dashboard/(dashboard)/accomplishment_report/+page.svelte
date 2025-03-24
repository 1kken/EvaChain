<script lang="ts">
	import type { PageData } from './$types';
	import { setAccomplishmentReportStore } from './(data)/accomp_state';
	import { createColumns } from './(table)/columns';
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import Create from './(table)/Create.svelte';
	import { onMount } from 'svelte';
	import TableSkeleton from '$lib/custom_components/TableSkeleton.svelte';

	//props
	let { data }: { data: PageData } = $props();
	const { createForm, deleteForm, updateForm } = data.accReportForm;

	//state
	let isAddDrawerOpen = $state(false);
	let isLoading = $state(true);
	//store
	const { currentUserAccomplishmentReport } = setAccomplishmentReportStore();
	onMount(() => {
		isLoading = true;
		data.accReport
			.then((accReport) => setAccomplishmentReportStore(accReport))
			.finally(() => (isLoading = false));
	});

	//columns
	const columns = createColumns(deleteForm, updateForm);
</script>

{#if isLoading}
	<TableSkeleton />
{:else}
	<DataTable
		{columns}
		data={$currentUserAccomplishmentReport}
		filterPlaceholder={'Search by title'}
		filterColumn={'title'}
	/>
{/if}
