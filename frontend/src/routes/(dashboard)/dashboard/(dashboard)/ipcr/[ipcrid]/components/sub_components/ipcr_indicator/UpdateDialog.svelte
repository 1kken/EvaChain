<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil, Save } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import type { IPCRFunctionIndicatorFormResult } from '../../../utils/types';
	import { Input } from '$lib/components/ui/input';
	import AutoCompleteOnlineInput from '$lib/custom_components/AutoCompleteOnlineInput.svelte';
	import { fetchProfileById, fetchProfileByname } from '../../../utils/page_loader_services';
	import { getIpcrIndicatorFormContext } from '../../../states/ipcr_indicator_form_state';
	import { getIpcrIndicatorStore } from '../../../states/ipcr_indicator_state';
	import { updateIpcrIndicatorSchema } from '../../../schema/ipcr_indicator_schema';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { getAuthStore } from '$lib/utils/authStore';
	import OpIndicator from './OpIndicator.svelte';
	import { getIpcrStore } from '../../../states/current_ipcr_state';
	const { currentProfile } = getAuthStore();
	import Accomplshments from './Accomplishments.svelte';

	//props
	interface Iprops {
		ipcrFunctionIndicator: Tables<'ipcr_indicator'>;
		isDrawerOpen: boolean;
	}

	let { ipcrFunctionIndicator, isDrawerOpen = $bindable() }: Iprops = $props();

	//stores
	const { updateForm } = getIpcrIndicatorFormContext();
	const { currentIpcrIndicators, updateIpcrIndicator } = getIpcrIndicatorStore();
	const { isReviewedRaw } = getIpcrStore();

	//states
	let isOpen = $state(false);

	let isReviewedDisabled = $state($isReviewedRaw);
	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateIpcrIndicatorSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentIpcrIndicators.some((ind) => {
					return (
						ind.final_output === form.data.final_output &&
						ind.id !== form.data.id &&
						!$isReviewedRaw
					);
				})
			) {
				setError(form, 'final_output', 'Output already exists');
			}
			if (
				$currentIpcrIndicators.some((ind) => {
					return (
						ind.success_indicator === form.data.success_indicator &&
						ind.id !== form.data.id &&
						!$isReviewedRaw
					);
				})
			) {
				setError(form, 'success_indicator', 'Success Indicator already exists');
			}
			const action = result.data as FormResult<IPCRFunctionIndicatorFormResult>;
			if (form.valid && action.ipcrFunctionIndicator) {
				const ipcrFunctionIndicator = action.ipcrFunctionIndicator;
				updateIpcrIndicator(ipcrFunctionIndicator.id, ipcrFunctionIndicator);
				showSuccessToast(`Successfully updated ipcr function indicator `);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: {
						...ipcrFunctionIndicator
					},
					newState: {
						...ipcrFunctionIndicator
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	$formData.id = ipcrFunctionIndicator.id;
	$formData.final_output = ipcrFunctionIndicator.final_output;
	$formData.success_indicator = ipcrFunctionIndicator.success_indicator;
	$formData.op_activity_indicator_id = ipcrFunctionIndicator.op_activity_indicator_id;
	$formData.immediate_supervisor_id = ipcrFunctionIndicator.immediate_supervisor_id;
	$formData.units = ipcrFunctionIndicator.units;
	$formData.quality_rating = ipcrFunctionIndicator.quality_rating;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding ipcr function indicator: ${$message.text}`);
		}
	});

	// Function to calculate average rating
	function calculateAverageRating() {
		// Get values, treating null or undefined as 0 for calculation logic
		const quality =
			$formData.quality_rating !== null && $formData.quality_rating !== undefined
				? $formData.quality_rating
				: null;

		const efficiency =
			$formData.efficiency_rating !== null && $formData.efficiency_rating !== undefined
				? $formData.efficiency_rating
				: null;

		const timeliness =
			$formData.timeliness_rating !== null && $formData.timeliness_rating !== undefined
				? $formData.timeliness_rating
				: null;

		// Sum only the non-null values
		let sum = 0;
		let count = 0;

		if (quality !== null) {
			sum += quality;
			count++;
		}

		if (efficiency !== null) {
			sum += efficiency;
			count++;
		}

		if (timeliness !== null) {
			sum += timeliness;
			count++;
		}

		// Calculate average if we have at least one value
		if (count > 0) {
			$formData.average_rating = parseFloat((sum / count).toFixed(2));
		} else {
			$formData.average_rating = null;
		}
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} />Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Edit IPCR Function Indicator</Dialog.Title>
			<Dialog.Description>
				An indicator is a measurable criterion used to assess the performance and success of a
				specific task or objective, aligning efforts with organizational goals.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateipcrindicator" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
			<div class=" grid gap-2 md:grid-cols-2">
				<Form.Field {form} name="final_output">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Major Final Output</Form.Label>
							<IntelligentInput
								disabled={isReviewedDisabled}
								textAreaWidth={'full'}
								placeholder="Provide major final output."
								bind:content={$formData.final_output}
								name={props.name}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="success_indicator">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Success Indicators</Form.Label>
							<IntelligentInput
								disabled={isReviewedDisabled}
								textAreaWidth={'full'}
								placeholder="Provide success indicator."
								bind:content={$formData.success_indicator}
								name={props.name}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			{#if !$isReviewedRaw}
				<OpIndicator
					disabled={isReviewedDisabled}
					ipcrOpIndicatorId={$formData.op_activity_indicator_id}
					handleIpcrOpIndicator={(e: string) => {
						$formData.op_activity_indicator_id = e;
					}}
				/>
			{/if}
			{#if !$isReviewedRaw}
				{#if ipcrFunctionIndicator.ipcr_function_id}
					<div class="grid grid-cols-2 gap-2">
						<Form.Field {form} name="immediate_supervisor_id">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Immediate Supervisor</Form.Label>
									<AutoCompleteOnlineInput
										disabled={isReviewedDisabled}
										bind:selectedId={$formData.immediate_supervisor_id}
										name={props.name}
										placeholder={'Type Immediate Supervisor here'}
										onSearch={fetchProfileByname}
										onFetchById={fetchProfileById}
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Form.Field {form} name="units">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Units</Form.Label>
									<Input
										disabled={isReviewedDisabled}
										type="number"
										step="0.1"
										placeholder={'Enter Number of Units for this category...'}
										{...props}
										bind:value={$formData.units}
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				{/if}
			{:else}
				<Form.Field {form} name="immediate_supervisor_id">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Immediate Supervisor</Form.Label>
							<AutoCompleteOnlineInput
								disabled={isReviewedDisabled}
								bind:selectedId={$formData.immediate_supervisor_id}
								name={props.name}
								placeholder={'Type Immediate Supervisor here'}
								onSearch={fetchProfileByname}
								onFetchById={fetchProfileById}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Accomplshments indicator={ipcrFunctionIndicator} />
			{/if}
			{#if $isReviewedRaw}
				<div class="grid gap-4 md:grid-cols-4">
					<Form.Field {form} name="quality_rating">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Quality Rating</Form.Label>
								<Input
									oninput={calculateAverageRating}
									type="number"
									step="0.1"
									placeholder={'Quality Rating...'}
									{...props}
									bind:value={$formData.quality_rating}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="efficiency_rating">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Efficiency Rating</Form.Label>
								<Input
									oninput={calculateAverageRating}
									type="number"
									step="0.1"
									placeholder={'Efficiency Rating...'}
									{...props}
									bind:value={$formData.efficiency_rating}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="timeliness_rating">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Timeliness Rating</Form.Label>
								<Input
									oninput={calculateAverageRating}
									type="number"
									step="0.1"
									placeholder={'Timeliness Rating...'}
									{...props}
									bind:value={$formData.timeliness_rating}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="average_rating">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Average Rating</Form.Label>
								<Input
									disabled
									type="number"
									step="0.1"
									placeholder={'Average Rating...'}
									{...props}
									bind:value={$formData.average_rating}
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
								placeholder="Provide remarks."
								bind:content={$formData.remarks}
								name={props.name}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{/if}
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
