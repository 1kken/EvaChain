<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import { createColumns } from './(table)/columns';
	import type { PageData } from './$types';
	import CreateDialogUnit from './(table)/create-dialog-unit.svelte';
	let { data }: { data: PageData } = $props();

	const {
		form: { createUnitForm, deleteUnitForm, updateUnitForm }
	} = data;

	const columns = createColumns(deleteUnitForm, updateUnitForm);
	let units = $derived(data.units);
</script>

<DataTable filterPlaceholder={'Search by name...'} data={units} {columns}>
	<CreateDialogUnit data={createUnitForm} />
</DataTable>
