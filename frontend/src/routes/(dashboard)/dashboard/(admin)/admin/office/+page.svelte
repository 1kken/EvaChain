<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import { office } from '$lib/states/admin_office.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	import { createColumns } from './(table)/column';
	import CreateDialogOffice from './(table)/create-dialog-office.svelte';
	import { unit } from '$lib/states/admin_unit.svelte';

	const {
		units,
		offices,
		supabase,
		form: { createOfficeForm, updateOfficeForm, deleteOfficeForm }
	} = data;

	unit.set(units);
	unit.subscribe(supabase);

	//fetch unit so it can be used
	onMount(() => {
		office.set(offices);
		office.subscribe(supabase);
	});

	onDestroy(() => {
		// Clean up subscription
		office.unsubscribe();
		unit.unsubscribe();
	});

	const columns = createColumns(updateOfficeForm, deleteOfficeForm);
</script>

<DataTable filterPlaceholder={'Search by name...'} {columns} data={office.offices}>
	<CreateDialogOffice data={createOfficeForm} />
</DataTable>
