<script lang="ts">
	import DataTable from '$lib/custom_components/university_management/data-table.svelte';
	import { office } from '$lib/states/admin_office.svelte';
	import { unit } from '$lib/states/admin_unit.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { createColumns } from './column';
	import { programme } from '$lib/states/admin_programme.svelte';
	import CreateDialogProgramme from '$lib/custom_components/university_management/programme/create-dialog-programme.svelte';

	let { data }: { data: PageData } = $props();

	const {
		programmes,
		units,
		offices,
		createProgrammeForm,
		updateProgrammeForm,
		deleteProgrammeForm,
		supabase
	} = data;

	programme.set(programmes);
	unit.set(units);
	office.set(offices);

	onMount(() => {
		unit.subscribe(supabase);
		office.subscribe(supabase);
		programme.subscribe(supabase);
	});

	onDestroy(() => {
		office.unsubscribe();
		unit.unsubscribe();
		programme.unsubscribe();
	});

	const columns = createColumns(updateProgrammeForm, deleteProgrammeForm);
</script>

<DataTable {columns} data={programme.programmes}>
	<CreateDialogProgramme data={createProgrammeForm} />
</DataTable>
