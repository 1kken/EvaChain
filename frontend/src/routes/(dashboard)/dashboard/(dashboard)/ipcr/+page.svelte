<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import { SquareArrowOutUpRight } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { getIPCRStore } from './(data)/state.svelte';
	import { createColumns } from './(table)/columns';
	import CreateIpcr from './(table)/CreateIPCR.svelte';
	import ShowLatestOpPlan from './components/ShowLatestOpPlan.svelte';

	let { data }: { data: PageData } = $props();
	const { createIPCRForm, deleteIPCRForm, updateIPCRForm } = data.form;
	const operationalPlanId = data.operationalPlanId;

	const { currentUserIPCR } = getIPCRStore();
	const columns = createColumns(deleteIPCRForm, updateIPCRForm);
</script>

<DataTable
	filterPlaceholder={'Search by name...'}
	filterColumn={'title'}
	{columns}
	data={$currentUserIPCR}
>
	<CreateIpcr data={createIPCRForm} />
	<ShowLatestOpPlan id={operationalPlanId} />
</DataTable>
