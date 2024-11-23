<script lang="ts">
	import DataTable from '$lib/custom_components/university_management/data-table.svelte';

	import { createColumns } from './columns';
	import type { PageData } from './$types';
	import { unit } from '$lib/states/admin_unit.svelte';
	import { onDestroy, onMount } from 'svelte';
	import CreateDialogUnit from '$lib/custom_components/university_management/units/create-dialog-unit.svelte';
	let { data }: { data: PageData } = $props();

	const {
		units,
		supabase,
		form: { createUnitForm, deleteUnitForm, updateUnitForm }
	} = data;

	const columns = createColumns(deleteUnitForm, updateUnitForm);
	unit.set(units);

	//fetch unit so it can be used
	onMount(() => {
		unit.subscribe(supabase);
	});

	onDestroy(() => {
		unit.unsubscribe();
	});
</script>

<DataTable data={unit.units} {columns}>
	<CreateDialogUnit data={createUnitForm} />
</DataTable>
