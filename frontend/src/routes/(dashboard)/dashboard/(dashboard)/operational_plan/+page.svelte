<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import CreateDialogOp from './(table)/create-dialog-op.svelte';
	import type { PageData } from './$types';
	import { createColumns } from './(table)/columns';
	import { setOperationalPlanStore } from './(data)/operational_plan_state.svelte';
	import { getUserAuthStore } from '$lib/utils/rbac';
	import ShowLatestOperationalPlan from './components/show-latest-operational-plan.svelte';
	import ShowLatestStrategicPlan from './components/show-latest-strategic-plan.svelte';
	import { onMount } from 'svelte';
	import TableSkeleton from '$lib/custom_components/TableSkeleton.svelte';

	let { data }: { data: PageData } = $props();
	const { operationalPlanId, strategicPlanId, opData } = data.data;
	const { createOp, updateOp, deleteOp } = data.form;
	const columns = createColumns(deleteOp, updateOp);
	const { hasRole } = getUserAuthStore();

	let isLoading = $state(true);
	const { currentOperationalPlans } = setOperationalPlanStore();
	onMount(() => {
		isLoading = true;
		opData
			.then((operationalPlans) => setOperationalPlanStore(operationalPlans))
			.finally(() => (isLoading = false));
	});
</script>

{#if isLoading}
	<TableSkeleton />
{:else}
	<DataTable
		data={$currentOperationalPlans}
		{columns}
		filterColumn={'title'}
		filterPlaceholder={'Search by title....'}
	>
		<CreateDialogOp data={createOp} />

		{#if hasRole('director') || hasRole('dean') || hasRole('head_of_office')}
			<ShowLatestOperationalPlan id={operationalPlanId?.id!} />
		{/if}

		{#if hasRole('vice-president') || hasRole('head_of_operating_unit')}
			<ShowLatestStrategicPlan id={strategicPlanId?.id!} />
		{/if}
	</DataTable>
{/if}
