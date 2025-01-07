<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { showWarningToast } from '$lib/utils/toast';
	import { getCurrentAccomplishmentReportTemplateStore } from '../states/accomplishment_report_state';
	import { getAccomplishmentMetricTemplateFormContext } from '../states/metrics_form_state';
	import { getAccomplishmentMetricsTemplateStore } from '../states/metrics_state';
	import Update from './sub_components/metrics/Update.svelte';

	let { metric }: { metric: Tables<'accomplishment_template_metrics'> } = $props();
	//states
	let isDrawerOpen = $state(false);

	//store
	const { removeAccomplishmentMetricTemplate } = getAccomplishmentMetricsTemplateStore();
	const { deleteForm } = getAccomplishmentMetricTemplateFormContext();
	const { canEdit } = getCurrentAccomplishmentReportTemplateStore();

	//functions
	function handleDelete(result: { type: string; data: any }) {
		if (result.data.metrics) {
			const metric = result.data.metrics;
			removeAccomplishmentMetricTemplate(metric.id);
			showWarningToast(`Successfully deleted metric`);
		}
	}
</script>

<div class="rounded-lg border">
	<header class=" top-0 flex h-10 items-center justify-between p-7 md:px-10">
		<div class="flex items-start gap-5 pr-4">
			<Badge variant={'secondary'} class="h-5 text-xs">Metric</Badge>
			{metric.metrics}
		</div>
		<div class="flex items-center gap-5">
			{#snippet deleteAction()}
				<UniversalDeleteAction
					id={metric.id}
					action="?/deletemetric"
					data={deleteForm}
					onDelete={handleDelete}
				/>
			{/snippet}
			{#snippet updateAction()}
				<Update {metric} />
			{/snippet}
			{#if $canEdit}
				<div class="flex gap-4">
					<DropDownWrapper bind:isDrawerOpen childrens={[updateAction, deleteAction]} />
				</div>
			{/if}
		</div>
	</header>
</div>
