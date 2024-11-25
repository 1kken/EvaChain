<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import { office } from '$lib/states/admin_office.svelte';
	import { unit } from '$lib/states/admin_unit.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { createColumns } from './(table)/column';
	import { programme } from '$lib/states/admin_programme.svelte';
	import CreateDialogProgramme from './(table)/create-dialog-programme.svelte';
	import {
		mapToOptions,
		type PropDataFacet,
		type PropOptionFacet
	} from '$lib/custom_components/data-table/helper';

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

	let unitOptions: PropOptionFacet[] = mapToOptions(unit.units, 'name', 'code');

	let officeOptions: PropOptionFacet[] = mapToOptions(office.offices, 'name', 'code');

	$effect(() => {
		unitOptions = mapToOptions(unit.units, 'name', 'code');
		officeOptions = mapToOptions(office.offices, 'name', 'code');
	});

	const propDataFacet: PropDataFacet[] = [
		{ column: 'unit', options: unitOptions },
		{ column: 'office', options: officeOptions }
	];
	const columns = createColumns(updateProgrammeForm, deleteProgrammeForm);
</script>

<DataTable
	filterDataFacet={propDataFacet}
	filterPlaceholder={'Search by name...'}
	{columns}
	data={programme.programmes}
>
	<CreateDialogProgramme data={createProgrammeForm} />
</DataTable>
