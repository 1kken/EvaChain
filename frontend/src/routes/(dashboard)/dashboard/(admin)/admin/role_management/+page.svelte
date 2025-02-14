<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import type { PageData } from './$types';
	import { createRoleWithPermissionsSchema } from './(data)/schema';
	import { createColumns } from './(table)/columns';
	import Create from './(table)/create.svelte';

	let { data }: { data: PageData } = $props();

	const forms = data.forms;

	let roles = $derived(data.roles);

	const columns = createColumns();
</script>

<DataTable filterPlaceholder={'Search by name...'} data={roles} {columns}>
	<Create data={forms.createForm} />
</DataTable>
