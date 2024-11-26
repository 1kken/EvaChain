<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { createColumns } from './(table)/column';
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import { natureOfWork } from '$lib/states/admin_nature_of_work.svelte';
	import CreateDialogNow from './(table)/create-dialog-now.svelte';

	let { data }: { data: PageData } = $props();
	const {
		supabase,
		natureOfWork: now,
		form: { createNowForm, deleteNowForm, updateNowForm }
	} = data;

	natureOfWork.set(now);
	natureOfWork.subscribe(supabase);
	onDestroy(() => {
		natureOfWork.unsubscribe();
	});

	const columns = createColumns(updateNowForm, deleteNowForm);
</script>

<DataTable
	filterPlaceholder="Search by type..."
	filterColumn="type"
	data={natureOfWork.natureOfWorks}
	{columns}
>
	<CreateDialogNow data={createNowForm} />
</DataTable>
