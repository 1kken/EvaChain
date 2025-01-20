<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle } from 'lucide-svelte';
	import { Pencil } from 'lucide-svelte';
	import SuperDebug, { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import type { OpActivityFormResult } from '../../../utils/type';
	import * as Select from '$lib/components/ui/select/index.js';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import FormSection from './FormSection.svelte';
	import { Input } from '$lib/components/ui/input';
	import { getOpActivityFormContext } from '../../../states/op_activity_form_state';
	import { getOpActivityStore } from '../../../states/op_activity_state';
	import { updateOpActivitySchema } from '../../../schema/op_activity_schema';
	import type { Tables } from '$lib/types/database.types';

	//props
	interface Iprops {
		opActivity: Tables<'op_activity'>;
		isDrawerOpen: boolean;
	}
	let { opActivity, isDrawerOpen = $bindable() }: Iprops = $props();

	//stores
	const { updateForm } = getOpActivityFormContext();
	const { updateOpActivity, currentOpActivities } = getOpActivityStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateOpActivitySchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentOpActivities.some(
					(opActivity) =>
						opActivity.activity.toLowerCase() === form.data.activity?.toLowerCase() &&
						opActivity.id !== form.data.id // Changed from activity to id
				)
			) {
				setError(form, 'activity', 'Activity already exists');
			}
			const action = result.data as FormResult<OpActivityFormResult>;
			if (form.valid && action.opActivity) {
				const opActivity = action.opActivity;
				updateOpActivity(opActivity.id, opActivity);
				showSuccessToast(`successfully updated Activity to the Objective`);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: { ...opActivity },
					newState: {
						...opActivity
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	// //set data that is needed
	$formData.id = opActivity.id;
	$formData.activity = opActivity.activity;
	$formData.input_type = opActivity.input_type;
	$formData.performance_indicator = opActivity.performance_indicator;
	$formData.former_state = opActivity.former_state;
	$formData.q1_target = opActivity.q1_target;
	$formData.q2_target = opActivity.q2_target;
	$formData.q3_target = opActivity.q3_target;
	$formData.q4_target = opActivity.q4_target;
	$formData.responsible_officer_unit = opActivity.responsible_officer_unit;
	$formData.total_budgetary_requirements = opActivity.total_budgetary_requirements;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding activity to the objective: ${$message.text}`);
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
			<Dialog.Title>Add Objectives & Activities</Dialog.Title>
			<Dialog.Description>
				Program/Project Objective: A concise statement outlining the goals and intended outcomes of
				the program or project.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateopactivity" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
			<FormSection title={'Basic Information'} required={true}>
				<div class="grid gap-4 md:grid-cols-2">
					<Form.Field {form} name="activity">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Activity</Form.Label>
								<IntelligentInput
									textAreaWidth={'full'}
									placeholder="Enter the activity for the program/project."
									bind:content={$formData.activity}
									name={props.name}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
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
				</div>
			</FormSection>
			<!--State information & Implementation Quarters-->
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
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
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
