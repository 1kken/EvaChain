<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { setDpcrStore } from './(data)/dpcr_state';
	import { createColumns } from './(table)/columns';
	import TableSkeleton from '$lib/custom_components/TableSkeleton.svelte';

	let { data }: { data: PageData } = $props();

	const DpcrForms = data.forms.DPCRForms;
	const columns = createColumns(DpcrForms.deleteForm, DpcrForms.updateForm);
	let isLoading = $state(true);

	const { currentDpcrs } = setDpcrStore();
	onMount(() => {
		isLoading = true;
		data.dpcrs.then((dpcrs) => setDpcrStore(dpcrs)).finally(() => (isLoading = false));
	});
</script>

{#if isLoading}
	<TableSkeleton />
{:else}
	<DataTable
		data={$currentDpcrs}
		{columns}
		filterColumn={'title'}
		filterPlaceholder={'Search by title....'}
	/>
{/if}
