<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil, Save } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import SuperDebug, { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { Input } from '$lib/components/ui/input';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { getOpcrIndicatorStore } from '../../../states/indicator_state';
	import { getOpcrIndicatorFormContext } from '../../../states/indicator_form_state';
	import { updateOpcrIndicatorSchema } from '../../../schema/indicator_schema';
	import type { OPCRIndicatorFormResult } from '../../../utils/types';

	//props
	interface Iprops {
		opcrIndicator: Tables<'opcr_indicator'>;
		isDrawerOpen: boolean;
	}

	let { opcrIndicator, isDrawerOpen = $bindable() }: Iprops = $props();
	//stores
	const { currentOpcrIndicators, updateOpcrIndicator } = getOpcrIndicatorStore();
	const { updateForm } = getOpcrIndicatorFormContext();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateOpcrIndicatorSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentOpcrIndicators.some(
					(ind) =>
						ind.success_indicator.toLocaleLowerCase() ===
							form.data.success_indicator.toLocaleLowerCase() && ind.id !== opcrIndicator.id
				)
			) {
				setError(form, 'success_indicator', 'Indicator already exists');
			}
			const action = result.data as FormResult<OPCRIndicatorFormResult>;
			if (form.valid && action.opcrIndicator) {
				const opcrIndicator = action.opcrIndicator;
				updateOpcrIndicator(opcrIndicator.id, opcrIndicator);
				showSuccessToast(`Succesfully updated OPCR indicator`);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: {
						efficiency_rating: opcrIndicator.efficiency_rating ?? 0,
						quality_rating: opcrIndicator.quality_rating ?? 0,
						timeliness_rating: opcrIndicator.timeliness_rating ?? 0,
						success_indicator: opcrIndicator.success_indicator ?? '',
						alloted_budget: opcrIndicator.alloted_budget ?? '',
						division_individuals_accountable: opcrIndicator.division_individuals_accountable ?? '',
						actual_accomplishments: opcrIndicator.actual_accomplishments ?? '',
						remarks: opcrIndicator.remarks
					},
					newState: {
						efficiency_rating: opcrIndicator.efficiency_rating ?? 0,
						quality_rating: opcrIndicator.quality_rating ?? 0,
						timeliness_rating: opcrIndicator.timeliness_rating ?? 0,
						success_indicator: opcrIndicator.success_indicator ?? '',
						alloted_budget: opcrIndicator.alloted_budget ?? '',
						division_individuals_accountable: opcrIndicator.division_individuals_accountable ?? '',
						actual_accomplishments: opcrIndicator.actual_accomplishments ?? '',
						remarks: opcrIndicator.remarks
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;

	$formData = {
		id: opcrIndicator.id,
		efficiency_rating: opcrIndicator.efficiency_rating ?? 0,
		quality_rating: opcrIndicator.quality_rating ?? 0,
		timeliness_rating: opcrIndicator.timeliness_rating ?? 0,
		average_rating: opcrIndicator.average_rating ?? 0,
		success_indicator: opcrIndicator.success_indicator ?? '',
		alloted_budget: opcrIndicator.alloted_budget ?? '',
		division_individuals_accountable: opcrIndicator.division_individuals_accountable ?? '',
		actual_accomplishments: opcrIndicator.actual_accomplishments ?? '',
		remarks: opcrIndicator.remarks
	};
	function calcAverageRating() {
		const quality = +$formData.quality_rating || 0;
		const efficiency = +$formData.efficiency_rating || 0;
		const timeliness = +$formData.timeliness_rating || 0;
		$formData.average_rating = Number(((quality + efficiency + timeliness) / 3).toFixed(2));
	}

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding dpcr function indicator: ${$message.text}`);
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
			<Dialog.Title>Update OPCR Indicator</Dialog.Title>
			<Dialog.Description>
				An indicator is a measurable criterion used to assess the performance and success of a
				specific task or objective, aligning efforts with organizational goals.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateindicator" method="POST" use:enhance class="space-y-6">
			<div>
				<Form.Field {form} name="success_indicator">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Add Success Indicator</Form.Label>
							<IntelligentInput
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
			<div class=" grid gap-2 md:grid-cols-2">
				<Form.Field {form} name="alloted_budget">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Add Alloted Budget</Form.Label>
							<Input
								placeholder={'Add Alloted Budget...'}
								{...props}
								bind:value={$formData.alloted_budget}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="division_individuals_accountable">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Division/Individuals Accountable</Form.Label>
							<Input
								placeholder={'Division/Individuals Accountable...'}
								{...props}
								bind:value={$formData.division_individuals_accountable}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<Form.Field {form} name="actual_accomplishments">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Actual Accomplishments</Form.Label>
						<Input
							placeholder={'Actual accomplishments...'}
							{...props}
							bind:value={$formData.actual_accomplishments}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="grid grid-cols-2 gap-2 md:grid-cols-4">
				<Form.Field {form} name="quality_rating">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Quality Rating</Form.Label>
							<Input
								type="number"
								placeholder={'5.0, 3.5...'}
								{...props}
								bind:value={$formData.quality_rating}
								oninput={calcAverageRating}
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
								type="number"
								placeholder={'5.0, 3.5...'}
								{...props}
								bind:value={$formData.efficiency_rating}
								oninput={calcAverageRating}
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
								type="number"
								placeholder={'5.0, 3.5...'}
								{...props}
								bind:value={$formData.timeliness_rating}
								oninput={calcAverageRating}
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
								type="number"
								disabled
								placeholder={'5.0, 3.5...'}
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
							placeholder="Remarks..."
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
