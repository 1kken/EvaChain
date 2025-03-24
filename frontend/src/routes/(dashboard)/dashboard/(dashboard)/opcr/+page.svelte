<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { setOpcrStore } from './(data)/opcr_state';
	import { createColumns } from './(table)/columns';
	import Create from './(table)/create.svelte';
	import TableSkeleton from '$lib/custom_components/TableSkeleton.svelte';

	let { data }: { data: PageData } = $props();

	const OpcrForms = data.forms.OPCRForms;
	const opcrs = data.opcrs;
	const columns = createColumns(OpcrForms.deleteForm, OpcrForms.updateForm);
	let isLoading = $state(true);
	//states
	const { currentOpcrs } = setOpcrStore();
	onMount(() => {
		isLoading = true;
		opcrs.then((opcrs) => setOpcrStore(opcrs)).finally(() => (isLoading = false));
	});
</script>

{#if isLoading}
	<TableSkeleton />
{:else}
	<DataTable
		data={$currentOpcrs}
		{columns}
		filterColumn={'title'}
		filterPlaceholder={'Search by title....'}
	>
		<Create data={OpcrForms.createForm} />
	</DataTable>
{/if}
