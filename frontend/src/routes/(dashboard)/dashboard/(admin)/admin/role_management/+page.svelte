<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import type { PageData } from './$types';
	import { createColumns } from './(table)/column';

	let { data }: { data: PageData } = $props();

	let profileDetails = $derived(data.profileDetails);

	const columns = createColumns(data.updateForm);
</script>

<DataTable
	filterColumn={'employee_id'}
	filterPlaceholder={'Search by employee id...'}
	{columns}
	data={profileDetails}
/>
