<script lang="ts">
	import { natureOfWork } from '$lib/states/admin_nature_of_work.svelte';
	import { position } from '$lib/states/admin_positions_state.svelte';
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';
	import { createColumns } from './(table)/column';
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import { map } from 'zod';
	import { mapToOptions, type PropDataFacet } from '$lib/custom_components/data-table/helper';
	import CreateDialogPosition from './(table)/create-dialog-position.svelte';

	let { data }: { data: PageData } = $props();

	const {
		positions,
		nows,
		supabase,
		form: { createPositionForm, updatePositionForm, deletePositionForm }
	} = data;

	natureOfWork.set(nows);
	position.set(positions);
	natureOfWork.subscribe(supabase);
	position.subscribe(supabase);
	onDestroy(() => {
		natureOfWork.unsubscribe();
		position.unsubscribe();
	});

	let nowOptions = mapToOptions(natureOfWork.natureOfWorks, 'type', 'type');

	$effect(() => {
		nowOptions = mapToOptions(natureOfWork.natureOfWorks, 'type', 'type');
	});

	const columns = createColumns(updatePositionForm, deletePositionForm);
	const propDataFacet: PropDataFacet[] = [{ column: 'nature_of_work', options: nowOptions }];
</script>

<DataTable
	filterDataFacet={propDataFacet}
	filterPlaceholder={'Search by Position title ...'}
	filterColumn={'type'}
	{columns}
	data={position.positions}
>
	<CreateDialogPosition data={createPositionForm} />
</DataTable>
