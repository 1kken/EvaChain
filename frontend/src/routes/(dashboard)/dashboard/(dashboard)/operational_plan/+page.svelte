<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import CreateDialogOp from './(table)/create-dialog-op.svelte';
	import type { PageData } from './$types';
	import { createColumns } from './(table)/columns';
	import { setOperationalPlanStore } from './(data)/operational_plan_state.svelte';

	let { data }: { data: PageData } = $props();
	const { createOp, updateOp, deleteOp } = data.form;
	const columns = createColumns(deleteOp, updateOp);
	const { currentOperationalPlans } = setOperationalPlanStore(data.data.opData);
</script>

<DataTable
	data={$currentOperationalPlans}
	{columns}
	filterColumn={'title'}
	filterPlaceholder={'Search by title....'}
>
	<CreateDialogOp data={createOp} />
</DataTable>
