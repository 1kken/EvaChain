<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import type { PageData } from './$types';
	import { setOpcrStore } from './(data)/opcr_state';
	import { createColumns } from './(table)/columns';
	import Create from './(table)/create.svelte';

	let { data }: { data: PageData } = $props();

	const OpcrForms = data.forms.OPCRForms;
	const opcrs = data.opcrs;
	const columns = createColumns(OpcrForms.deleteForm, OpcrForms.updateForm);
	//states
	const { currentOpcrs } = setOpcrStore(opcrs);
</script>

<DataTable
	data={$currentOpcrs}
	{columns}
	filterColumn={'title'}
	filterPlaceholder={'Search by title....'}
>
	<Create data={OpcrForms.createForm} />
</DataTable>
