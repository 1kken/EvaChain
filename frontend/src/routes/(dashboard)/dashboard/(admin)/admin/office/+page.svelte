<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	import { createColumns } from './(table)/column';
	import CreateDialogOffice from './(table)/create-dialog-office.svelte';
	import {
		mapToOptions,
		type PropDataFacet,
		type PropOptionFacet
	} from '$lib/custom_components/data-table/helper';

	const {
		form: { createOfficeForm, updateOfficeForm, deleteOfficeForm }
	} = data;

	let units = $derived(data.units);
	let offices = $derived(data.offices);

	// svelte-ignore state_referenced_locally
	let unitOptions: PropOptionFacet[] = mapToOptions(units, 'name', 'code');
	const propDataFacet: PropDataFacet[] = [{ column: 'unit', options: unitOptions }];
	// svelte-ignore state_referenced_locally
	const columns = createColumns(updateOfficeForm, deleteOfficeForm, units);
</script>

<DataTable
	filterDataFacet={propDataFacet}
	filterPlaceholder={'Search by name...'}
	{columns}
	data={offices}
>
	<CreateDialogOffice data={createOfficeForm} {units} />
</DataTable>
