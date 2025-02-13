<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { createColumns } from './(table)/column';
	import CreateDialogProgram from './(table)/create-dialog-program.svelte';
	import {
		mapToOptions,
		type PropDataFacet,
		type PropOptionFacet
	} from '$lib/custom_components/data-table/helper';

	let { data }: { data: PageData } = $props();

	const { createProgramForm, updateProgramForm, deleteProgramForm } = data;

	let units = $derived(data.units);
	let offices = $derived(data.offices);
	let programs = $derived(data.programs);

	// svelte-ignore state_referenced_locally
	let unitOptions: PropOptionFacet[] = mapToOptions(units, 'name', 'code');
	// svelte-ignore state_referenced_locally
	let officeOptions: PropOptionFacet[] = mapToOptions(offices, 'name', 'code');

	const propDataFacet: PropDataFacet[] = [
		{ column: 'unit', options: unitOptions },
		{ column: 'office', options: officeOptions }
	];

	// svelte-ignore state_referenced_locally
	const columns = createColumns(updateProgramForm, deleteProgramForm, units, offices);
</script>

<DataTable
	filterDataFacet={propDataFacet}
	filterPlaceholder={'Search by name...'}
	{columns}
	data={programs}
>
	<CreateDialogProgram data={createProgramForm} {units} {offices} />
</DataTable>
