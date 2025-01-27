<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import type { PageData } from './$types';
	import { setStrategicPlanStore } from './(data)/strat_plan_state';
	import { createColumns } from './(table)/columns';
	import Create from './(table)/create.svelte';

	let { data }: { data: PageData } = $props();

	const strategicForm = data.forms.strategicPlanForms;
	const strategicPlans = data.strategicPlans;

	//state
	const { currentPlans } = setStrategicPlanStore();
	$currentPlans = strategicPlans;
	const columns = createColumns(strategicForm.deleteForm, strategicForm.updateForm);
</script>

<DataTable
	data={$currentPlans}
	{columns}
	filterColumn={'title'}
	filterPlaceholder={'Search by title....'}
>
	<Create data={strategicForm.createForm} />
</DataTable>
