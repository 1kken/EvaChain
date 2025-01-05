<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil, Plus } from 'lucide-svelte';
	import SuperDebug, { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { Input } from '$lib/components/ui/input';
	import type { Tables } from '$lib/types/database.types';
	import { getAccomplishmentMetricTemplateFormContext } from '../../../states/metrics_form_state';
	import { getAccomplishmentMetricsTemplateStore } from '../../../states/metrics_state';
	import { updateAccomplishmentMetricSchemaTemplate } from '../../../schema/metrics_schema';
	import type { MetricsFormResult } from '../../../utils/types';

	let { metric }: { metric: Tables<'accomplishment_template_metrics'> } = $props();

	//stores
	const { updateForm } = getAccomplishmentMetricTemplateFormContext();
	const { currentAccomplishmentMetricsTemplate, updateAccomplishmentMetricTemplate, size } =
		getAccomplishmentMetricsTemplateStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateAccomplishmentMetricSchemaTemplate),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentAccomplishmentMetricsTemplate.some(
					(metric) => metric.metrics === result.data.metrics.metrics && metric.id !== metric.id
				)
			) {
				setError(form, 'metrics', 'Metrics already exists');
			}
			const action = result.data as FormResult<MetricsFormResult>;
			if (form.valid && action.metrics) {
				const metric = action.metrics;
				updateAccomplishmentMetricTemplate(metric.id, metric);
				showSuccessToast(`Successfully updated metric ${metric.metrics}`);
				isOpen = false;
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
	$formData.metrics = metric.metrics;
	$formData.former_state = metric.former_state;
	$formData.annual_target = metric.annual_target;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding program/project: ${$message.text}`);
		}
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} />Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Edit Accomplishment Metrics</Dialog.Title>
			<Dialog.Description>Add metrics to track in your accomplishment report.</Dialog.Description>
		</Dialog.Header>
		<form action="?/updatemetric" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
			<Form.Field {form} name="metrics">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Accomplisment Metrics</Form.Label>
						<IntelligentInput
							textAreaWidth={'full'}
							placeholder="Enter metrics"
							bind:content={$formData.metrics}
							name={props.name}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="grid grid-cols-2 space-x-2">
				<Form.Field {form} name="former_state">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Former State</Form.Label>
							<Input {...props} bind:value={$formData.former_state} placeholder="Former state" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="annual_target">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Annual Target</Form.Label>
							<Input {...props} bind:value={$formData.annual_target} placeholder="Annual target" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="flex w-full justify-end">
				{#if $delayed}
					<Form.Button disabled><LoaderCircle class="animate-spin" />Processing...</Form.Button>
				{:else}
					<Form.Button>Submit</Form.Button>
				{/if}
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
