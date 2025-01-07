<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { cn } from '$lib/utils';
	import { showWarningToast } from '$lib/utils/toast';
	import { getCurrentAccomplishmentReportStore } from '../states/current_accomplishment_report_state';
	import { getAccomplishmentMetricFormContext } from '../states/metrics_form_state';
	import { getAccomplishmentMetricsStore } from '../states/metrics_state';
	import ToggleInclude from './sub_components/metrics/ToggleInclude.svelte';
	import Update from './sub_components/metrics/Update.svelte';
	import UpdateWithTemplate from './sub_components/metrics/UpdateWithTemplate.svelte';

	let { metric }: { metric: Tables<'accomplishment_metrics'> } = $props();
	//states
	let isDrawerOpen = $state(false);

	//store
	const { removeAccomplishmentMetric } = getAccomplishmentMetricsStore();
	const { deleteForm } = getAccomplishmentMetricFormContext();
	const { isUsingTemplate } = getCurrentAccomplishmentReportStore();

	//functions
	function handleDelete(result: { type: string; data: any }) {
		if (result.data.metrics) {
			const metric = result.data.metrics;
			removeAccomplishmentMetric(metric.id);
			showWarningToast(`Successfully deleted metric`);
		}
	}
</script>

<div class="rounded-lg border">
	<header class=" top-0 flex h-10 items-center justify-between p-7 md:px-10">
		<div class="flex items-start gap-5 pr-4">
			<Badge variant={'secondary'} class="h-5 text-xs">Metric</Badge>
			<span class={cn('text-sm font-semibold', { 'line-through': !metric.is_included })}>
				{metric.metrics}
			</span>
		</div>
		<div class="flex items-center gap-5">
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={metric.id}
					action="?/deletemetric"
					data={deleteForm}
					onDelete={handleDelete}
					name={metric.metrics}
				/>
			{/snippet}
			{#snippet updateAction()}
				<Update {metric} />
			{/snippet}
			{#if !$isUsingTemplate}
				<div class="flex gap-4">
					<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
				</div>
			{:else}
				{#snippet uninclude()}
					<ToggleInclude bind:isDrawerOpen {metric} />
				{/snippet}
				{#snippet updateWithTemplate()}
					<UpdateWithTemplate {metric} />
				{/snippet}
				<DropDownWrapper bind:isDrawerOpen childrens={[uninclude, updateWithTemplate]} />
			{/if}
		</div>
	</header>
</div>
