<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil } from 'lucide-svelte';
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
	import { updateAccomplishmentActivityIndicatorSchema } from '../../../schema/indicator_schema';
	import type { Tables } from '$lib/types/database.types';

	//props
	interface Iprops {
		indicator: Tables<'accomplishment_activity_indicator'>;
		isDrawerOpen: boolean;
	}

	let { indicator, isDrawerOpen = $bindable() }: Iprops = $props();

	//stores
	const { updateForm } = getAccomplishmentActivityIndicatorFormContext();
	const { size, updateAccomplishmentActivityIndicator, currentAccomplishmentActivityIndicators } =
		getAccomplishmentActivityIndicatorStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateAccomplishmentActivityIndicatorSchema),
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
				updateAccomplishmentActivityIndicator(indicator.id, indicator);
				showSuccessToast(`Successfully updated indicator`);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: {
						...indicator
					},
					newState: {
						...indicator
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	// //set data that is needed
	$formData = {
		...indicator
	};
	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding activity to the annual plan: ${$message.text}`);
		}
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class=" focus-visible:outline-none" id="nav-2">
		<span class="flex items-center gap-3">
			<Pencil size={16} />Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Edit Indicator</Dialog.Title>
			<Dialog.Description>
				Indicators are the specific, measurable, and time-bound targets that will be used to measure
				the success of the program/project.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateindicator" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input hidden name="id" value={$formData.id} />
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
