<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Plus } from 'lucide-svelte';
	import SuperDebug, { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { createAccomplishmentProgramProjectSchema } from '../../../schema/program_project_schema';
	import type { MetricsFormResult, ProgramProjectFormResult } from '../../../utils/type';
	import { getAccomplishmentMetricFormContext } from '../../../states/metrics_form_state';
	import { getAccomplishmentMetricsStore } from '../../../states/metrics_state';
	import { createAccomplishmentMetricSchema } from '../../../schema/metrics_schema';
	import { Input } from '$lib/components/ui/input';
	import { browser } from '$app/environment';

	//props
	interface Iprops {
		programProjectId: string;
	}
	let { programProjectId }: Iprops = $props();

	//stores
	const { createForm } = getAccomplishmentMetricFormContext();
	const { currentAccomplishmentMetrics, addAccomplishmentMetric, size } =
		getAccomplishmentMetricsStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(createForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(createAccomplishmentMetricSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if ($currentAccomplishmentMetrics.some((metric) => metric.metrics === result.data.metrics)) {
				setError(form, 'metrics', 'Metrics already exists');
			}
			const action = result.data as FormResult<MetricsFormResult>;
			if (form.valid && action.metrics) {
				const metric = action.metrics;
				addAccomplishmentMetric(metric);
				showSuccessToast(`Successfully added metric ${metric.metrics}`);
				isOpen = false;
				reset({
					data: {
						accomplishment_program_project_id: programProjectId,
						position: $size + 1
					},
					newState: {
						accomplishment_program_project_id: programProjectId,
						position: $size + 1
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;

	$formData.accomplishment_program_project_id = programProjectId;
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
			<Dialog.Title>Add Accomplishment Metrics</Dialog.Title>
			<Dialog.Description>Add metrics to track in your accomplishment report.</Dialog.Description>
		</Dialog.Header>
		<form action="?/createmetric" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input
				hidden
				name="accomplishment_program_project_id"
				value={$formData.accomplishment_program_project_id}
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
							<Input {...props} bind:value={$formData.former_state} placeholder="Formet state" />
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
