<script lang="ts">
	import type { PageData } from './$types';
	import { setAccomplishmentReportStore } from './(data)/accomp_state';
	import { createColumns } from './(table)/columns';
	import DataTable from '$lib/custom_components/data-table/data-table.svelte';
	import Create from './(table)/Create.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import { ChevronDown } from 'lucide-svelte';
	import CreateWithTemplate from './components/CreateWithTemplate.svelte';

	//props
	let { data }: { data: PageData } = $props();
	const { createForm, deleteForm, updateForm } = data.accReportForm;

	//state
	let isAddDrawerOpen = $state(false);
	//store
	const { currentUserAccomplishmentReport } = setAccomplishmentReportStore(data.accReport);

	//columns
	const columns = createColumns(deleteForm, updateForm);
</script>

{#snippet createWithoutTemplate()}
	<Create bind:isAddDrawerOpen data={createForm} />
{/snippet}

{#snippet createWithTemplate()}
	<CreateWithTemplate bind:isAddDrawerOpen data={createForm} />
{/snippet}

<DataTable
	{columns}
	data={$currentUserAccomplishmentReport}
	filterPlaceholder={'Search by title'}
	filterColumn={'title'}
>
	<div class="w-[380px]">
		<DropDownWrapper
			icon={ChevronDown}
			text={'Create options'}
			childrens={[createWithoutTemplate, createWithTemplate]}
			bind:isDrawerOpen={isAddDrawerOpen}
		/>
	</div>
</DataTable>
