<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import { office } from '$lib/states/admin_office.svelte';
	import { unit } from '$lib/states/admin_unit.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { createColumns } from './(table)/column';
	import { program } from '$lib/states/admin_program.svelte';
	import CreateDialogProgram from './(table)/create-dialog-program.svelte';
	import {
		mapToOptions,
		type PropDataFacet,
		type PropOptionFacet
	} from '$lib/custom_components/data-table/helper';

	let { data }: { data: PageData } = $props();

	const {
		programs,
		units,
		offices,
		createProgramForm,
		updateProgramForm,
		deleteProgramForm,
		supabase
	} = data;

	program.set(programs);
	unit.set(units);
	office.set(offices);

	onMount(() => {
		unit.subscribe(supabase);
		office.subscribe(supabase);
		program.subscribe(supabase);
	});

	onDestroy(() => {
		office.unsubscribe();
		unit.unsubscribe();
		program.unsubscribe();
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
	const columns = createColumns(updateProgramForm, deleteProgramForm);
</script>

<DataTable
	filterDataFacet={propDataFacet}
	filterPlaceholder={'Search by name...'}
	{columns}
	data={program.programs}
>
	<CreateDialogProgram data={createProgramForm} />
</DataTable>
