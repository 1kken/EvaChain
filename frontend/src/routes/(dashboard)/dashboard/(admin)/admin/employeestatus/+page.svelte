<script lang="ts">
	import { employeeStatus } from '$lib/states/admin_employee_status.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { createColumns } from './(table)/column';
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import CreateDialogEps from './(table)/create-dialog-eps.svelte';

	let { data }: { data: PageData } = $props();
	const {
		supabase,
		employeeStatus: dataEps,
		form: { createEpsForm, deleteEpsForm, updateEpsForm }
	} = data;

	employeeStatus.set(dataEps);
	employeeStatus.subscribe(supabase);

	onDestroy(() => {
		employeeStatus.unsubscribe();
	});

	const columns = createColumns(updateEpsForm, deleteEpsForm);
</script>

<DataTable
	filterPlaceholder="Search by type..."
	filterColumn="type"
	data={employeeStatus.employeeStatuses}
	{columns}
>
	<CreateDialogEps data={createEpsForm} />
</DataTable>
