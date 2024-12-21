<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle } from 'lucide-svelte';
	import { Pencil } from 'lucide-svelte';
	import SuperDebug, { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import type { OpActivityFormResult, OpObjectiveFormResult } from '../../../utils/type';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import FormSection from './FormSection.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { browser } from '$app/environment';
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
						opActivity.activity === form.data.activity && opActivity.id !== form.data.id // Changed from activity to id
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
	$formData.indicator = opActivity.indicator;
	$formData.former_state = opActivity.former_state;
	$formData.desired_state = opActivity.desired_state;
	$formData.q1 = opActivity.q1;
	$formData.q2 = opActivity.q2;
	$formData.q3 = opActivity.q3;
	$formData.q4 = opActivity.q4;
	$formData.item = opActivity.item;
	$formData.qty = opActivity.qty;
	$formData.unit = opActivity.unit;
	$formData.unit_cost = opActivity.unit_cost;
	$formData.amount = opActivity.amount;
	$formData.fund_source = opActivity.fund_source;
	$formData.entity_responsible = opActivity.entity_responsible;

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
					<Form.Field {form} name="indicator">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Performance Indicator</Form.Label>
								<IntelligentInput
									textAreaWidth={'full'}
									placeholder="Enter the performance indicator for the program/project."
									bind:content={$formData.indicator}
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
				<div class="grid gap-6 md:grid-cols-3">
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
					<Form.Field {form} name="desired_state">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Desired State</Form.Label>
								<Input
									{...props}
									bind:value={$formData.desired_state}
									placeholder="Enter desired state..."
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<div class="space-y-2">
						<Label class="required mb-3 block">Implementation Quarters</Label>
						<div class="grid grid-cols-2 gap-4">
							<Form.Field {form} name="q1">
								<Form.Control>
									{#snippet children({ props })}
										<span class="flex items-center gap-2">
											<Checkbox {...props} bind:checked={$formData.q1} />
											<Label>Q1</Label>
										</span>
									{/snippet}
								</Form.Control>
							</Form.Field>
							<Form.Field {form} name="q2">
								<Form.Control>
									{#snippet children({ props })}
										<span class="flex items-center gap-2">
											<Checkbox {...props} bind:checked={$formData.q2} />
											<Label>Q2</Label>
										</span>
									{/snippet}
								</Form.Control>
							</Form.Field>
							<Form.Field {form} name="q3">
								<Form.Control>
									{#snippet children({ props })}
										<span class="flex items-center gap-2">
											<Checkbox {...props} bind:checked={$formData.q3} />
											<Label>Q3</Label>
										</span>
									{/snippet}
								</Form.Control>
							</Form.Field>
							<Form.Field {form} name="q4">
								<Form.Control>
									{#snippet children({ props })}
										<span class="flex items-center gap-2">
											<Checkbox {...props} bind:checked={$formData.q4} />
											<Label>Q4</Label>
										</span>
									{/snippet}
								</Form.Control>
							</Form.Field>
						</div>
					</div>
				</div>
			</FormSection>
			<FormSection title="Financial Information" required={true}>
				<div class="grid gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Form.Field {form} name="former_state">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Item</Form.Label>
									<Input {...props} bind:value={$formData.item} placeholder="Enter item state..." />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>

					<div class="space-y-2">
						<Form.Field {form} name="qty">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Quantity</Form.Label>
									<Input
										{...props}
										bind:value={$formData.qty}
										placeholder="Enter quantity state..."
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>

					<div class="space-y-2">
						<Form.Field {form} name="unit">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Unit</Form.Label>
									<Input {...props} bind:value={$formData.unit} placeholder="Enter unit..." />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>

					<div class="space-y-2">
						<Form.Field {form} name="unit_cost">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Unit Cost</Form.Label>
									<Input
										{...props}
										bind:value={$formData.unit_cost}
										placeholder="Enter unit cost..."
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					<div class="w-full flex-1 md:col-span-2">
						<Form.Field {form} name="amount">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Total Amount</Form.Label>
									<Input
										{...props}
										bind:value={$formData.amount}
										placeholder="Enter total amount..."
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				</div>
			</FormSection>
			<FormSection title="Additional Information">
				<div class="grid gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Form.Field {form} name="fund_source">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Fund Source</Form.Label>
									<Input
										{...props}
										bind:value={$formData.fund_source}
										placeholder="Enter fund source..."
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>

					<div class="space-y-2">
						<Form.Field {form} name="entity_responsible">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Entity Responsible</Form.Label>
									<Input
										{...props}
										bind:value={$formData.entity_responsible}
										placeholder="Enter entity responsible..."
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
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
		{#if browser}
			<SuperDebug data={$formData} />
		{/if}
	</Dialog.Content>
</Dialog.Root>
