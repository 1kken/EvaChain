<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { showWarningToast } from '$lib/utils/toast';
	import { getAccomplishmentActivityIndicatorFormContext } from '../states/activity_indicator_form_state';
	import { getAccomplishmentActivityIndicatorStore } from '../states/activity_indicator_state';
	import type { ActivityIndicatorFormResult } from '../utils/type';
	import Update from './sub_components/indicator/Update.svelte';
	import ViewIndicator from './ViewIndicator.svelte';

	let { indicator }: { indicator: Tables<'accomplishment_activity_indicator'> } = $props();
	//states
	let isDrawerOpen = $state(false);

	//store
	const { removeAccomplishmentActivityIndicator } = getAccomplishmentActivityIndicatorStore();
	const { deleteForm } = getAccomplishmentActivityIndicatorFormContext();

	//functions
	function handleDelete(result: { type: string; data: ActivityIndicatorFormResult }) {
		if (result.data.accIndicator) {
			const accIndicator = result.data.accIndicator;
			removeAccomplishmentActivityIndicator(accIndicator.id);
			showWarningToast(`Successfully deleted indicator`);
		}
	}
</script>

<div class="rounded-lg border">
	<header class=" top-0 flex h-10 items-center justify-between gap-1 p-7 md:px-10">
		<Badge variant={'secondary'} class="h-5 flex-shrink-0 bg-amber-500 text-xs">Indicator</Badge>
		<div class="min-w-0 flex-1">
			<ViewIndicator {indicator} />
		</div>
		<div class="flex items-center gap-5">
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={indicator.id}
					action="?/deleteindicator"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateAction()}
				<Update bind:isDrawerOpen {indicator} />
			{/snippet}
			<div class="flex gap-4">
				<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
			</div>
		</div>
	</header>
</div>
