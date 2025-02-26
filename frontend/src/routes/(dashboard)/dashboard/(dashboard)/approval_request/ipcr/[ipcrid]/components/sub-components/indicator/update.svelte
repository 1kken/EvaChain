<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil, Save } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { Input } from '$lib/components/ui/input';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { getIpcrIndicatorFormContext } from '../../../states/indicator_form_state';
	import { updateIpcrIndicatorSchema } from '../../../schema/indicator_schema';
	import Accomplishment from './accomplishment.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { getSupervisorDetailStore } from '../../../states/ipcr_supervisor_state';

	//props
	interface Iprops {
		ipcrFunctionIndicator: Tables<'ipcr_indicator'>;
		isDrawerOpen: boolean;
	}

	let { ipcrFunctionIndicator, isDrawerOpen = $bindable() }: Iprops = $props();

	//store
	const { updateForm } = getIpcrIndicatorFormContext();
	const { currentSupervisorDetail } = getSupervisorDetailStore();
	let isUnderReview = $currentSupervisorDetail?.status === 'under_review';
	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateIpcrIndicatorSchema),
		multipleSubmits: 'prevent',
		invalidateAll: true,
		onUpdate({ form, result }) {
			if (form.valid && result.type === 'success') {
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
	$formData.quality_rating = ipcrFunctionIndicator.quality_rating;
	$formData.efficiency_rating = ipcrFunctionIndicator.efficiency_rating;
	$formData.timeliness_rating = ipcrFunctionIndicator.timeliness_rating;
	$formData.average_rating = ipcrFunctionIndicator.average_rating;
	$formData.remarks = ipcrFunctionIndicator.remarks;

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
		<form action="?/updateindicator" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
			<div class=" grid gap-2 md:grid-cols-2">
				<div>
					<Label>Major Final Output</Label>
					<Textarea
						rows={4}
						disabled
						value={ipcrFunctionIndicator.final_output}
						placeholder="Type your message here."
					/>
				</div>
				<div>
					<Label>Success Indicators</Label>
					<Textarea
						disabled
						rows={4}
						value={ipcrFunctionIndicator.success_indicator}
						placeholder="Type your message here."
					/>
				</div>
			</div>
			<Accomplishment indicator={ipcrFunctionIndicator} />
			<div class="grid gap-4 md:grid-cols-4">
				<Form.Field {form} name="quality_rating">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Quality Rating</Form.Label>
							<Input
								disabled={!isUnderReview}
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
								disabled={!isUnderReview}
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
								disabled={!isUnderReview}
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
							disabled={!isUnderReview}
							textAreaWidth={'full'}
							placeholder="Provide remarks."
							bind:content={$formData.remarks}
							name={props.name}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
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
