<script lang="ts">
	import DataTable from './data-table.svelte';
	import { createColumns } from './columns';
	import type { PageData } from './$types';
	import { unit } from '$lib/states/admin_unit.svelte';
	import { onDestroy, onMount } from 'svelte';
	let { data }: { data: PageData } = $props();

	const { units } = data;
	const {
		form: { createUnitForm, deleteUnitForm, updateUnitForm }
	} = data;
	const { supabase } = data;
	onMount(() => {
		unit.set(units);
		unit.subscribe(supabase);
	});

	onDestroy(() => {
		// Clean up subscription
		unit.unsubscribe();
	});

	const columns = createColumns(deleteUnitForm, updateUnitForm);
</script>

<DataTable data={unit.units} {columns} {createUnitForm} />
