<script lang="ts">
	import type { PageData } from './$types';
	import { createColumns } from './(table)/column';
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import {
		mapToOptions,
		type PropDataFacet,
		type PropOptionFacet
	} from '$lib/custom_components/data-table/helper';
	import CreateDialogPosition from './(table)/create-dialog-position.svelte';

	let { data }: { data: PageData } = $props();

	let {
		form: { createPositionForm, updatePositionForm, deletePositionForm }
	} = data;

	let natureOfWorks = $derived(data.nows);
	let positions = $derived(data.positions);

	// svelte-ignore state_referenced_locally
	const columns = createColumns(updatePositionForm, deletePositionForm, natureOfWorks);
	// svelte-ignore state_referenced_locally
	let nowOptions: PropOptionFacet[] = mapToOptions(natureOfWorks, 'type', 'type');
	let propDataFacet: PropDataFacet[] = [{ column: 'nature_of_work', options: nowOptions }];
</script>

<DataTable
	filterDataFacet={propDataFacet}
	filterPlaceholder={'Search by Position title ...'}
	filterColumn={'type'}
	{columns}
	data={positions}
>
	<CreateDialogPosition data={createPositionForm} natureOfWork={natureOfWorks} />
</DataTable>
