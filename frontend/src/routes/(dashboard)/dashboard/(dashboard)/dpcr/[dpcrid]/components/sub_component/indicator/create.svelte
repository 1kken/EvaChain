<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Save } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import SuperDebug, { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { Input } from '$lib/components/ui/input';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { getDpcrIndicatorStore } from '../../../states/indicator_state';
	import { getDpcrIndicatorFormContext } from '../../../states/indicator_form_state';
	import { createDpcrIndicatorSchema } from '../../../schema/indicator_schema';
	import type { DPCRIndicatorFormResult } from '../../../utils/types';
	import { browser } from '$app/environment';

	//props
	interface Iprops {
		dpcrFunctionId?: string;
		dpcrCategoryId?: string;
		isDrawerOpen: boolean;
	}

	let { dpcrFunctionId, dpcrCategoryId, isDrawerOpen = $bindable() }: Iprops = $props();
	//stores
	const { currentDpcrIndicators, addDpcrIndicator, size } = getDpcrIndicatorStore();
	const { createForm } = getDpcrIndicatorFormContext();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(createForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(createDpcrIndicatorSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentDpcrIndicators.some(
					(ind) =>
						ind.success_indicator.toLocaleLowerCase() ===
						form.data.success_indicator.toLocaleLowerCase()
				)
			) {
				setError(form, 'success_indicator', 'Indicator already exists');
			}
			const action = result.data as FormResult<DPCRIndicatorFormResult>;
			if (form.valid && action.dpcrIndicator) {
				const dpcrIndicator = action.dpcrIndicator;
				addDpcrIndicator(dpcrIndicator);
				showSuccessToast(`Succesfully added dpcr  indicator `);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: {
						dpcr_function_id: dpcrFunctionId ?? null,
						dpcr_function_category_id: dpcrCategoryId ?? null,
						position: $size + 1
					},
					newState: {
						dpcr_function_id: dpcrFunctionId ?? null,
						dpcr_function_category_id: dpcrCategoryId ?? null,
						position: $size + 1
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	if (dpcrFunctionId) {
		$formData.dpcr_function_id = dpcrFunctionId;
		//set to null the others
		$formData.dpcr_function_category_id = null;
	}

	if (dpcrCategoryId) {
		$formData.dpcr_function_category_id = dpcrCategoryId;
		//set to null the others
		$formData.dpcr_function_id = null;
	}

	$formData.position = $size + 1;
	$formData.average_rating = 0;
	$formData.quality_rating = 0;
	$formData.efficiency_rating = 0;
	$formData.timeliness_rating = 0;

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
	<Dialog.Trigger class="focus-visible:outline-none" id="nav-2">
		<span class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			<span class=" md:inline">Add DPCR Indicator</span>
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Add DPCR Indicator</Dialog.Title>
			<Dialog.Description>
				An indicator is a measurable criterion used to assess the performance and success of a
				specific task or objective, aligning efforts with organizational goals.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createindicator" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			{#if $formData.dpcr_function_category_id}
				<input
					hidden
					name="dpcr_function_category_id"
					value={$formData.dpcr_function_category_id}
				/>
			{:else}
				<input hidden name="dpcr_function_id" value={$formData.dpcr_function_id} />
			{/if}
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
			<div class="grid grid-cols-2 gap-2">
				<Form.Field {form} name="physical_targets">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Physical Targets</Form.Label>
							<Input
								placeholder={'Physical Targets...'}
								{...props}
								bind:value={$formData.physical_targets}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
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
			</div>
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
