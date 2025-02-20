<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import FormSection from './FormSection.svelte';
	import { Input } from '$lib/components/ui/input';
	import type { ActivityIndicatorFormResult } from '../../../utils/type';
	import * as Select from '$lib/components/ui/select/index.js';
	import { getAccomplishmentActivityIndicatorFormContext } from '../../../states/activity_indicator_form_state';
	import { getAccomplishmentActivityIndicatorStore } from '../../../states/activity_indicator_state';
	import { createAccomplishmentActivityIndicatorSchema } from '../../../schema/indicator_schema';

	//props
	interface Iprops {
		activityId: string;
		isExpanded: boolean;
		onToggle: () => Promise<void>;
	}

	let { activityId, isExpanded = $bindable(), onToggle }: Iprops = $props();

	//stores
	const { createForm } = getAccomplishmentActivityIndicatorFormContext();
	const { size, addAccomplishmentActivityIndicator, currentAccomplishmentActivityIndicators } =
		getAccomplishmentActivityIndicatorStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(createForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(createAccomplishmentActivityIndicatorSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentAccomplishmentActivityIndicators.some(
					(activity) => activity.performance_indicator === form.data.performance_indicator
				)
			) {
				setError(form, 'performance_indicator', 'Indicator already exists');
			}
			const action = result.data as FormResult<ActivityIndicatorFormResult>;
			if (form.valid && action.accIndicator) {
				const indicator = action.accIndicator;
				addAccomplishmentActivityIndicator(indicator);
				showSuccessToast(`Successfully added indicator`);
				isOpen = false;
				isExpanded = true;
				reset({
					data: {
						accomplishment_activity_id: activityId,
						position: $size + 1
					},
					newState: {
						accomplishment_activity_id: activityId,
						position: $size + 1
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	// //set data that is needed
	$formData.accomplishment_activity_id = activityId;
	$formData.position = $size + 1;
	$formData.input_type = 'text';

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding activity to the annual plan: ${$message.text}`);
		}
	});
</script>

<Dialog.Root bind:open={isOpen} onOpenChange={onToggle}>
	<Dialog.Trigger class=" focus-visible:outline-none" id="nav-2">
		<span class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			<span class="hidden md:inline">Add Indicator</span>
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Add Indicator</Dialog.Title>
			<Dialog.Description>
				Indicators are the specific, measurable, and time-bound targets that will be used to measure
				the success of the program/project.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createindicator" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input
				hidden
				name="accomplishment_activity_id"
				value={$formData.accomplishment_activity_id}
			/>
			<FormSection title={'Basic Information'} required={true}>
				<Form.Field {form} name="performance_indicator">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Performance Indicator</Form.Label>
							<IntelligentInput
								textAreaWidth={'full'}
								placeholder="Enter the performance indicator for the program/project."
								bind:content={$formData.performance_indicator}
								name={props.name}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</FormSection>
			<FormSection title="State Information & Implementation Quarters" required={true}>
				<div class="grid grid-cols-1 md:grid-cols-2 md:space-x-2">
					<Form.Field {form} name="input_type">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Measurement metric</Form.Label>
								<Select.Root type="single" bind:value={$formData.input_type} name={props.name}>
									<Select.Trigger {...props}>
										{$formData.input_type
											? $formData.input_type
											: 'Select the measurement metric to apply." '}
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="text" label="text" />
										<Select.Item value="number" label="number" />
										<Select.Item value="ratio" label="ratio" />
										<Select.Item value="percentage" label="percentage" />
									</Select.Content>
								</Select.Root>
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
									bind:value={$formData.annual_target}
									placeholder="Enter annual target..."
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 md:space-x-2">
					<Form.Field {form} name="q1_accomplishment">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Quarter 1 Accomplishment</Form.Label>
								<Input
									{...props}
									bind:value={$formData.q1_accomplishment}
									placeholder="Enter accomplishment..."
								/>
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="q2_accomplishment">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Quarter 2 Accomplishment</Form.Label>
								<Input
									{...props}
									bind:value={$formData.q2_accomplishment}
									placeholder="Enter accomplishment..."
								/>
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 md:space-x-2">
					<Form.Field {form} name="q3_accomplishment">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Quarter 3 Accomplishment</Form.Label>
								<Input
									{...props}
									bind:value={$formData.q3_accomplishment}
									placeholder="Enter accomplishment..."
								/>
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="q4_accomplishment">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Quarter 4 Target</Form.Label>
								<Input
									{...props}
									bind:value={$formData.q4_accomplishment}
									placeholder="Enter accomplishment..."
								/>
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				<Form.Field {form} name="total">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Accomplishment Total</Form.Label>
							<Input
								{...props}
								bind:value={$formData.total}
								placeholder="Enter total accomplishment..."
							/>
						{/snippet}
					</Form.Control>
				</Form.Field>
			</FormSection>
			<FormSection title="Additional Information" required={true}>
				<div class="grid gap-4 md:grid-cols-2">
					<Form.Field {form} name="accomplishment_rate">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Accomplishment Rate</Form.Label>
								<Input
									{...props}
									bind:value={$formData.accomplishment_rate}
									placeholder="Enter  accomplishment rate..."
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="responsible_officer_unit">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Responsible Officer/Units</Form.Label>
								<Input
									{...props}
									bind:value={$formData.responsible_officer_unit}
									placeholder="Enter responsible officer/unit..."
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<Form.Field {form} name="remarks">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Remarks</Form.Label>
							<IntelligentInput
								textAreaWidth={'full'}
								placeholder="Enter remarks..."
								bind:content={$formData.remarks}
								name={props.name}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</FormSection>
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
