<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Save } from 'lucide-svelte';
	import { Pencil } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import type { OpIndicatorFormResult } from '../../../utils/type';
	import * as Select from '$lib/components/ui/select/index.js';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import FormSection from './FormSection.svelte';
	import { Input } from '$lib/components/ui/input';
	import type { Tables } from '$lib/types/database.types';
	import { calculateTotal } from './helper';
	import { getOpIndicatorFormContext } from '../../../states/op_indicator_form_state';
	import { getOpIndicatorStore } from '../../../states/op_indicator_state';
	import { updateOpcrIndicatorSchema } from '../../../../../opcr/[opcrid]/schema/indicator_schema';
	import { updateOpActivityIndicatorSchema } from '../../../schema/op_indicator_schema';

	//props
	interface Iprops {
		opIndicator: Tables<'op_activity_indicator'>;
		isDrawerOpen: boolean;
	}
	let { opIndicator, isDrawerOpen = $bindable() }: Iprops = $props();

	//stores
	const { updateForm } = getOpIndicatorFormContext();
	const { updateOpIndicator, currentOpIndicators } = getOpIndicatorStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateOpActivityIndicatorSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentOpIndicators.some(
					(opIndicator) =>
						opIndicator.performance_indicator.toLowerCase() ===
							form.data.performance_indicator?.toLowerCase() && opIndicator.id !== form.data.id
				)
			) {
				setError(form, 'performance_indicator', 'Indicator already exists');
			}
			const action = result.data as FormResult<OpIndicatorFormResult>;
			if (form.valid && action.opIndicator) {
				const opIndicator = action.opIndicator;
				updateOpIndicator(opIndicator.id, opIndicator);
				showSuccessToast(`Successfully Updated Activity Indicator!`);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: { ...opIndicator },
					newState: {
						...opIndicator
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	// //set data that is needed
	$formData.id = opIndicator.id;
	$formData.input_type = opIndicator.input_type;
	$formData.performance_indicator = opIndicator.performance_indicator;
	$formData.former_state = opIndicator.former_state;
	$formData.q1_target = opIndicator.q1_target;
	$formData.q2_target = opIndicator.q2_target;
	$formData.q3_target = opIndicator.q3_target;
	$formData.q4_target = opIndicator.q4_target;
	$formData.total = opIndicator.total;
	$formData.responsible_officer_unit = opIndicator.responsible_officer_unit;
	$formData.total_budgetary_requirements = opIndicator.total_budgetary_requirements;
	$formData.remarks = opIndicator.remarks;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding activity to the objective: ${$message.text}`);
		}
	});

	//for total
	let handleInputChange = () => {
		$formData.total = calculateTotal(
			$formData.q1_target,
			$formData.q2_target,
			$formData.q3_target,
			$formData.q4_target,
			$formData.input_type
		);
	};
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} />Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Edit Indicator</Dialog.Title>
			<Dialog.Description>
				Indicator: A concise statement outlining the goals and intended outcomes of the activity.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateopindicator" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
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
			<!--State information & Implementation Quarters-->
			<FormSection title="State Information & Implementation Quarters" required={true}>
				<div class="grid grid-cols-1 md:grid-cols-2 md:space-x-2">
					<Form.Field {form} name="input_type">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Measurement metric</Form.Label>
								<Select.Root
									type="single"
									bind:value={$formData.input_type}
									name={props.name}
									onValueChange={handleInputChange}
								>
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
					<Form.Field {form} name="former_state">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Former State</Form.Label>
								<Input
									{...props}
									bind:value={$formData.former_state}
									placeholder="Enter former state..."
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 md:space-x-2">
					<Form.Field {form} name="q1_target">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Quarter 1 Target</Form.Label>
								<Input
									{...props}
									bind:value={$formData.q1_target}
									placeholder="Enter former state..."
									oninput={handleInputChange}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="q2_target">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Quarter 2 Target</Form.Label>
								<Input
									{...props}
									bind:value={$formData.q2_target}
									placeholder="Enter former state..."
									oninput={handleInputChange}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 md:space-x-2">
					<Form.Field {form} name="q3_target">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Quarter 3 Target</Form.Label>
								<Input
									{...props}
									bind:value={$formData.q3_target}
									placeholder="Enter former state..."
									oninput={handleInputChange}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="q4_target">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Quarter 4 Target</Form.Label>
								<Input
									{...props}
									bind:value={$formData.q4_target}
									placeholder="Enter former state..."
									oninput={handleInputChange}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<Form.Field {form} name="total">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Total</Form.Label>
							<Input
								{...props}
								bind:value={$formData.total}
								placeholder="Auto calculated... Except 'TEXT' "
							/>
						{/snippet}
					</Form.Control>
				</Form.Field>
			</FormSection>
			<FormSection title="Additional Information" required={true}>
				<div class="grid gap-4 md:grid-cols-2">
					<div class="space-y-2">
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
					<Form.Field {form} name="total_budgetary_requirements">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Total Budgetary Requirements</Form.Label>
								<Input
									{...props}
									bind:value={$formData.total_budgetary_requirements}
									placeholder="Enter total budgetary requirements..."
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
								placeholder="Enter remarks"
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
					<Form.Button disabled class="w-full"
						><LoaderCircle class="animate-spin" />Processing...</Form.Button
					>
				{:else}
					<Form.Button class="w-full"><Save />Save</Form.Button>
				{/if}
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
