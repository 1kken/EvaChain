<script lang="ts">
	import DataTable from './data-table.svelte';
	import { createColumns } from './columns';
	import type { PageData } from './$types';
	import { unit } from '$lib/states/admin_unit.svelte';
	import { onDestroy, onMount } from 'svelte';
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

<DataTable data={unit.units} {columns} {createUnitForm} />
