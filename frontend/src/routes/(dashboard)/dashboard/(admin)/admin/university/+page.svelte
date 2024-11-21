<script lang="ts">
	import DataTable from './data-table.svelte';
	import { columns } from './columns';
	import type { PageData } from './$types';
	import { unit } from '$lib/states/admin_unit.svelte';
	import { onDestroy, onMount } from 'svelte';
	let { data }: { data: PageData } = $props();

	const { units } = data;
	const { form } = data;
	const { supabase } = data;
	onMount(() => {
		unit.set(units);
		// Subscribe to changes
		unit.subscribe(supabase);
	});

	onDestroy(() => {
		// Clean up subscription
		unit.unsubscribe();
	});
</script>

<DataTable data={unit.units} {columns} {form} />
