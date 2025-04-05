<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { setStrategicPlanStore } from './(data)/strat_plan_state';
	import { createColumns } from './(table)/columns';
	import Create from './(table)/create.svelte';
	import TableSkeleton from '$lib/custom_components/TableSkeleton.svelte';

	let { data }: { data: PageData } = $props();

	const strategicForm = data.forms.strategicPlanForms;
	const strategicPlans = data.strategicPlans;
	let isLoading = $state(true);

	//state
	const { currentPlans } = setStrategicPlanStore();
	onMount(() => {
		isLoading = true;
		strategicPlans.then((plans) => setStrategicPlanStore(plans)).finally(() => (isLoading = false));
	});

	const columns = createColumns(strategicForm.deleteForm, strategicForm.updateForm);
</script>

{#if isLoading}
	<TableSkeleton />
{:else}
	<DataTable
		data={$currentPlans}
		{columns}
		filterColumn={'title'}
		filterPlaceholder={'Search by title....'}
	>
		<Create data={strategicForm.createForm} />
	</DataTable>
{/if}
