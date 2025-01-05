<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Plus } from 'lucide-svelte';
	import SuperDebug, { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { Input } from '$lib/components/ui/input';
	import { getAccomplishmentMetricTemplateFormContext } from '../../../states/metrics_form_state';
	import { getAccomplishmentMetricsTemplateStore } from '../../../states/metrics_state';
	import { createAccomplishmentMetricSchemaTemplate } from '../../../schema/metrics_schema';
	import type { MetricsFormResult } from '../../../utils/types';

	//props
	interface Iprops {
		programProjectId: string;
	}
	let { programProjectId }: Iprops = $props();

	//stores
	const { createForm } = getAccomplishmentMetricTemplateFormContext();
	const { currentAccomplishmentMetricsTemplate, addAccomplishmentMetricTemplate, size } =
		getAccomplishmentMetricsTemplateStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(createForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(createAccomplishmentMetricSchemaTemplate),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentAccomplishmentMetricsTemplate.some(
					(metric) =>
						metric.metrics.toLowerCase().trim() === result.data.metrics.metrics.toLowerCase().trim()
				)
			) {
				setError(form, 'metrics', 'Metrics already exists');
			}
			const action = result.data as FormResult<MetricsFormResult>;
			if (form.valid && action.metrics) {
				const metric = action.metrics;
				addAccomplishmentMetricTemplate(metric);
				showSuccessToast(`Successfully added metric ${metric.metrics}`);
				isOpen = false;
				reset({
					data: {
						accomplishment_template_program_project_id: programProjectId,
						position: $size + 1
					},
					newState: {
						accomplishment_template_program_project_id: programProjectId,
						position: $size + 1
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;

	$formData.accomplishment_template_program_project_id = programProjectId;
	$formData.position = $size + 1;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding program/project: ${$message.text}`);
		}
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none" id="nav-2">
		<span class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			<span class="hidden md:inline">Add Metrics</span>
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Add Accomplishment Metrics (Template)</Dialog.Title>
			<Dialog.Description>Add metrics to track in your accomplishment report.</Dialog.Description>
		</Dialog.Header>
		<form action="?/createmetric" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input
				hidden
				name="accomplishment_program_project_template_id"
				value={$formData.accomplishment_template_program_project_id}
			/>
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
