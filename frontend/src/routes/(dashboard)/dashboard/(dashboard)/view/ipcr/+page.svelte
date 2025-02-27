<script lang="ts">
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import type { PageData } from './$types';
	import { createColumns } from './(table)/columns';

	let { data }: { data: PageData } = $props();
	let ipcr = $derived(data.ipcrs);
	import { getUserAuthStore } from '$lib/utils/rbac';
	import {
		mapToOptions,
		type PropDataFacet,
		type PropOptionFacet
	} from '$lib/custom_components/data-table/helper';
	const { hasRole } = getUserAuthStore();
	const isHeadOfUnit = hasRole('head_of_operating_unit');
	let columns = createColumns(isHeadOfUnit);

	let officeOptions: PropOptionFacet[] = [];
	if (isHeadOfUnit && data.offices) {
		officeOptions = mapToOptions(data.offices, 'name', 'code');
	}

	const propDataFacet: PropDataFacet[] = [{ column: 'office_name', options: officeOptions }];
</script>

{#if isHeadOfUnit}
	<DataTable
		filterDataFacet={propDataFacet}
		filterPlaceholder={'Search by employee_id...'}
		filterColumn={'employee_id'}
		{columns}
		data={ipcr}
	/>
{:else}
	<DataTable
		filterPlaceholder={'Search by employee_id...'}
		filterColumn={'employee_id'}
		{columns}
		data={ipcr}
		visibleColumns={{ office_code: isHeadOfUnit, nature_of_work: isHeadOfUnit }}
	/>
{/if}
