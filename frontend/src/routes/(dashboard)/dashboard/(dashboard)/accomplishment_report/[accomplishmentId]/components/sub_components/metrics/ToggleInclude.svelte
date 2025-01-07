<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import type { Tables } from '$lib/types/database.types';
	import { CircleCheckBig, CircleOff, TriangleAlert, X } from 'lucide-svelte';
	import { getAccomplishmentMetricFormContext } from '../../../states/metrics_form_state';
	import { getAccomplishmentMetricsStore } from '../../../states/metrics_state';
	import { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toggleIsIncludeMetricsSchema } from '../../../schema/metrics_schema';
	import type { MetricsFormResult } from '../../../utils/type';
	import { showErrorToast, showSuccessToast, showWarningToast } from '$lib/utils/toast';
	import { Input } from '$lib/components/ui/input';
	//props
	let {
		metric,
		isDrawerOpen = $bindable()
	}: { metric: Tables<'accomplishment_metrics'>; isDrawerOpen: boolean } = $props();

	//stores
	const { toggleIsIncludeForm } = getAccomplishmentMetricFormContext();
	const { currentAccomplishmentMetrics, updateAccomplishmentMetric, size } =
		getAccomplishmentMetricsStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(toggleIsIncludeForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(toggleIsIncludeMetricsSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<MetricsFormResult>;
			if (form.valid && action.metrics) {
				const metric = action.metrics;
				updateAccomplishmentMetric(metric.id, metric);
				if (metric.is_included) {
					showSuccessToast(`Successfully included metric ${metric.metrics}`);
				} else {
					showWarningToast(`Successfully excluded metric ${metric.metrics}`);
				}
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: {
						...metric
					},
					newState: {
						...metric
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	$formData.id = metric.id;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding program/project: ${$message.text}`);
			reset({
				data: {
					...metric
				},
				newState: {
					...metric
				}
			});
		}
	});
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger class="focus-visible:outline-none">
		{#if metric.is_included}
			<span class="flex items-center gap-3">
				<CircleOff size={16} /> Exclude
			</span>
		{:else}
			<span class="flex items-center gap-3">
				<CircleCheckBig size={16} /> Include
			</span>
		{/if}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				<span class="flex items-center gap-4">
					<TriangleAlert class="text-yellow-600" /> Are you absolutely sure?
				</span>
			</AlertDialog.Title>
			<AlertDialog.Description>
				{metric.is_included
					? 'This metric will be excluded from the final report. You can add it back using the "Include" button.'
					: 'This metric will be included in the final report. You can remove it using the "Exclude" button.'}
			</AlertDialog.Description>
		</AlertDialog.Header>

		<form method="POST" action="?/toggleisincludedmetrics" use:enhance>
			<Input name="id" class="hidden" bind:value={$formData.id} />
			<AlertDialog.Footer>
				<AlertDialog.Cancel type="button">Cancel</AlertDialog.Cancel>
				<AlertDialog.Action>Continue</AlertDialog.Action>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
