<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import type { PageData } from './$types';
	import { setDpcrStore } from './(data)/dpcr_state';
	import { createColumns } from './(table)/columns';
	import Create from './(table)/create.svelte';

	let { data }: { data: PageData } = $props();

	const DpcrForms = data.forms.DPCRForms;
	const dpcrs = data.dpcrs;
	const columns = createColumns(DpcrForms.deleteForm, DpcrForms.updateForm);
	//states
	const { currentDpcrs } = setDpcrStore(dpcrs);
</script>

<DataTable
	data={$currentDpcrs}
	{columns}
	filterColumn={'title'}
	filterPlaceholder={'Search by title....'}
>
	<Create data={DpcrForms.createForm} />
</DataTable>
