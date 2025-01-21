<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronDown } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import type { Tables } from '$lib/types/database.types';
	import { showWarningToast, showErrorToast } from '$lib/utils/toast';
	import { getAccomplishmentHeaderFormContext } from '../states/header_form_state';
	import { getAccomplishmentHeaderStore } from '../states/header_state';
	import type { HeaderFormResult } from '../utils/type';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import Update from './sub_components/header/Update.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import { setAccomplishmentAnnualPlanStore } from '../states/annual_plan_state';
	import { fetchAnnualPlan } from '../utils/page_loader';
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import { slide } from 'svelte/transition';
	import Create from './sub_components/annual_plan/Create.svelte';
	import AnnualPlan from './AnnualPlan.svelte';

	//props
	interface Iprops {
		accHeader: Tables<'accomplishment_header'>;
	}
	let { accHeader }: Iprops = $props();

	//stores
	const { deleteForm } = getAccomplishmentHeaderFormContext();
	const { removeAccomplishmentHeader } = getAccomplishmentHeaderStore();
	const { currentAccomplishmentAnnualPlans } = setAccomplishmentAnnualPlanStore();

	//states
	let dndItems = $state<Tables<'accomplishment_annual_plan'>[]>([]);
	let isLoading = $state(false);
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let error = $state<string | undefined>();

	//functions
	function handleDelete(result: { type: string; data: HeaderFormResult }) {
		if (result.data.accHeader) {
			const accHeader = result.data.accHeader;
			removeAccomplishmentHeader(accHeader.id);
			showWarningToast(`Successfully deleted ${accHeader.title}`);
		}
	}

	const updateAnnualPlanPosition = async (
		items: Tables<'accomplishment_annual_plan'>[]
	): Promise<void> => {
		const response = await fetch('/api/accomplishment_report/annual_plan', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(items)
		});

		if (!response.ok) {
			throw new Error('Failed to update positions');
		}

		$currentAccomplishmentAnnualPlans = items;
	};
	$effect(() => {
		dndItems = $currentAccomplishmentAnnualPlans;
	});

	// Separate fetch function
	async function fetchData() {
		isLoading = true;
		error = undefined;

		try {
			const result = await fetchAnnualPlan(accHeader.id);
			if (result.error) {
				error = result.error;
				showErrorToast(result.error);
				return;
			}
			dndItems = result.data;
			$currentAccomplishmentAnnualPlans = result.data;
		} catch (e) {
			error = e instanceof Error ? e.message : 'An unknown error occurred';
			showErrorToast(error);
		} finally {
			isLoading = false;
		}
	}

	// Simplified toggle function
	async function toggleExpand() {
		isExpanded = !isExpanded;

		if (isExpanded && dndItems.length === 0) {
			await fetchData();
		}
	}
</script>

<div class="w-full">
	<header class="sticky top-0 flex h-10 items-center justify-between border-b px-4 md:px-10">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" onclick={toggleExpand}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<h2>
				{accHeader.title}
			</h2>
		</div>
		<div class="flex items-center gap-5">
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={accHeader.id}
					name={accHeader.title}
					action="?/deleteaccheader"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateAction()}
				<Update bind:isDrawerOpen {accHeader} />
			{/snippet}
			<div class="flex gap-4">
				<Create headerId={accHeader.id} onToggle={fetchData} />
				<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
			</div>
		</div>
	</header>

	{#if isExpanded}
		<div class="p-4" transition:slide={{ duration: 300 }}>
			<DndContainer
				{isLoading}
				errorMessage={error}
				bind:items={dndItems}
				onPositionsUpdate={updateAnnualPlanPosition}
				emptyMessage="No annual plan found"
			>
				{#each dndItems as annualPlan (annualPlan.id)}
					<AnnualPlan {annualPlan} />
				{/each}
			</DndContainer>
		</div>
	{/if}
</div>
