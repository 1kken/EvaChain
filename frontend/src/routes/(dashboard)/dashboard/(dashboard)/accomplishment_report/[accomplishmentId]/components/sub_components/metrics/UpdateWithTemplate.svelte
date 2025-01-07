<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil, Plus } from 'lucide-svelte';
	import SuperDebug, { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import type { MetricsFormResult } from '../../../utils/type';
	import { getAccomplishmentMetricFormContext } from '../../../states/metrics_form_state';
	import { getAccomplishmentMetricsStore } from '../../../states/metrics_state';
	import {
		createAccomplishmentMetricSchema,
		updateAccomplishmentMetricSchema
	} from '../../../schema/metrics_schema';
	import { Input } from '$lib/components/ui/input';
	import type { Tables } from '$lib/types/database.types';
	import { browser } from '$app/environment';

	let { metric }: { metric: Tables<'accomplishment_metrics'> } = $props();

	//stores
	const { updateForm } = getAccomplishmentMetricFormContext();
	const { currentAccomplishmentMetrics, updateAccomplishmentMetric, size } =
		getAccomplishmentMetricsStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateAccomplishmentMetricSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentAccomplishmentMetrics.some(
					(metric) => metric.metrics === result.data.metrics && metric.id !== metric.id
				)
			) {
				setError(form, 'metrics', 'Metrics already exists');
			}
			const action = result.data as FormResult<MetricsFormResult>;
			if (form.valid && action.metrics) {
				const metric = action.metrics;
				updateAccomplishmentMetric(metric.id, metric);
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
	$formData.quarter_1_accomplishment = metric.quarter_1_accomplishment;
	$formData.quarter_2_accomplishment = metric.quarter_2_accomplishment;
	$formData.quarter_3_accomplishment = metric.quarter_3_accomplishment;
	$formData.quarter_4_accomplishment = metric.quarter_4_accomplishment;
	$formData.total_accomplishment = metric.total_accomplishment;
	$formData.variance = metric.variance;
	$formData.remarks = metric.remarks;

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
							disabled={true}
							textAreaWidth={'full'}
							placeholder="Enter metrics"
							bind:content={metric.metrics}
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
							<Input
								{...props}
								bind:value={metric.former_state}
								placeholder="Former state"
								disabled
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="annual_target">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Annual Target</Form.Label>
							<Input
								{...props}
								bind:value={metric.annual_target}
								placeholder="Annual target"
								disabled
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="gird-cols-1 grid space-x-2 md:grid-cols-4">
				<Form.Field {form} name="quarter_1_accomplishment">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>1st Quarter</Form.Label>
							<Input
								{...props}
								bind:value={$formData.quarter_1_accomplishment}
								placeholder="1st quarter accomplishment"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="quarter_2_accomplishment">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>2nd Quarter</Form.Label>
							<Input
								{...props}
								bind:value={$formData.quarter_2_accomplishment}
								placeholder="2nd quarter accomplishment"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="quarter_3_accomplishment">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>3rd quarter</Form.Label>
							<Input
								{...props}
								bind:value={$formData.quarter_3_accomplishment}
								placeholder="3rd quarter accomplishment"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="quarter_4_accomplishment">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>4th quarter</Form.Label>
							<Input
								{...props}
								bind:value={$formData.quarter_4_accomplishment}
								placeholder="4th quarter accomplishment"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="grid grid-cols-1 space-x-2 md:grid-cols-2">
				<Form.Field {form} name="total_accomplishment">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Total Accomplishment</Form.Label>
							<Input
								{...props}
								bind:value={$formData.total_accomplishment}
								placeholder="Total accomplishment"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="variance">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Variance</Form.Label>
							<Input {...props} bind:value={$formData.variance} placeholder="Variance" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<Form.Field {form} name="remarks">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Accomplsihment Remarks</Form.Label>
						<IntelligentInput
							textAreaWidth={'full'}
							placeholder="Enter remarks"
							bind:content={$formData.remarks}
							name={props.name}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

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
