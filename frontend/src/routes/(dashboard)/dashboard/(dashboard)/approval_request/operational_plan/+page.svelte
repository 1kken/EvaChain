<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import type { PageData } from './$types';
	import { createColumns } from './(table)/columns';

	let { data }: { data: PageData } = $props();

	let operationalPlan = $derived(data.op);
	const { uuidForm, revisionForm } = data;
	let columns = createColumns(uuidForm, revisionForm);
</script>

<DataTable
	filterPlaceholder="Search by title..."
	filterColumn="title"
	{columns}
	data={operationalPlan}
/>
