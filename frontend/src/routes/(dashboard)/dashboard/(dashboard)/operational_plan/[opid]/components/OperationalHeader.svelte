<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronDown } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import type { Tables } from '$lib/types/database.types';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import { getOpHeaderStore } from '../states/op_header_state';
	import { getOpHeaderFormContext } from '../states/op_header_form_state';
	import type { OpAnnualPlanFormResult, OpHeaderFormResult } from '../utils/type';
	import { showWarningToast, showErrorToast } from '$lib/utils/toast';
	import UpdateDialog from './sub_components/op_header/UpdateDialog.svelte';
	import DndContainer from '$lib/custom_components/dashboard/documents/DndContainer.svelte';
	import CreateDialogAnnualPlan from './sub_components/op_annual_plan/CreateDialog.svelte';
	import { slide } from 'svelte/transition';
	import { fetchOpAnnualPlans } from '../utils/page_load_services';
	import OperationalAnnualPlan from './OperationalAnnualPlan.svelte';
	import { setOpAnnualPlanStore } from '../states/op_annual_plan_state';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import { getOperationalPlanStore } from '../states/current_operational_plan_state';

	//props
	interface Iprops {
		opHeader: Tables<'op_header'>;
	}
	let { opHeader }: Iprops = $props();

	//stores
	const { removeOpHeader } = getOpHeaderStore();
	const { deleteForm } = getOpHeaderFormContext();
	const { currentOpAnnualPlans } = setOpAnnualPlanStore();
	const { canEdit } = getOperationalPlanStore();

	//states
	let dndItems = $state<Tables<'op_annual_plan'>[]>([]);
	let isLoading = $state(false);
	let isExpanded = $state(false);
	let isDrawerOpen = $state(false);
	let error = $state<string | null>(null);

	//functions
	function handleDelete(result: { type: string; data: OpHeaderFormResult }) {
		if (result.data.opHeader) {
			const opHeader = result.data.opHeader;
			removeOpHeader(opHeader.id);
			showWarningToast(`Successfully deleted ${opHeader.title}`);
		}
	}

	const updateOpProgramProjectPosition = async (
		items: Tables<'op_annual_plan'>[]
	): Promise<void> => {
		const response = await fetch('/api/operational_plan/annual_plan', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(items)
		});

		if (!response.ok) {
			throw new Error('Failed to update positions');
		}

		$currentOpAnnualPlans = items;
	};

	$effect(() => {
		dndItems = $currentOpAnnualPlans;
	});

	// Separate fetch function
	async function fetchData() {
		isLoading = true;
		error = null;

		try {
			const result = await fetchOpAnnualPlans(opHeader.id);
			if (result.error) {
				error = result.error;
				showErrorToast(result.error);
				return;
			}
			dndItems = result.data;
			$currentOpAnnualPlans = result.data;
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
			<h2 class="text-md md:text-md text-base font-bold">{opHeader.title}</h2>
		</div>
		<div class="flex items-center gap-5">
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={opHeader.id}
					name={opHeader.title}
					action="?/deleteopheader"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateAction()}
				<UpdateDialog bind:isDrawerOpen {opHeader} />
			{/snippet}
			{#if $canEdit}
				<div class="flex gap-4">
					<CreateDialogAnnualPlan opHeaderId={opHeader.id} onToggle={fetchData} bind:isExpanded />
					<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
				</div>
			{/if}
		</div>
	</header>

	{#if isExpanded}
		<div class="p-4" transition:slide={{ duration: 300 }}>
			{#if isLoading}
				<div class="flex justify-center">Loading program projects...</div>
			{:else if error}
				<div class="text-destructive text-center">
					{error}
				</div>
			{:else if dndItems.length === 0}
				<div class="text-muted-foreground text-center">No Annual Plans Found</div>
			{:else}
				<DndContainer
					bind:items={dndItems}
					onPositionsUpdate={updateOpProgramProjectPosition}
					emptyMessage="No Annual Plans Found"
				>
					{#each dndItems as opAnnualPlans (opAnnualPlans.id)}
						<OperationalAnnualPlan opAnnualPlan={opAnnualPlans} />
					{/each}
				</DndContainer>
			{/if}
		</div>
	{/if}
</div>
