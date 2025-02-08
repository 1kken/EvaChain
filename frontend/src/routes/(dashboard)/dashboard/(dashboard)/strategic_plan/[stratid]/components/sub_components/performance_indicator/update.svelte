<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil, Save, Trash2 } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import SuperDebug, { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { Input } from '$lib/components/ui/input';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { browser } from '$app/environment';
	import { getStrategyPerformanceIndicatorStore } from '../../../states/performance_indicator_state';
	import { getStrategyPerformanceIndicatorFormContext } from '../../../states/performance_indicator_form_state';
	import {
		createStrategyPlanPerformanceIndicatorSchema,
		updateStrategyPlanPerformanceIndicatorSchema
	} from '../../../schema/performance_indicator_schema';
	import type { PerformanceIndicatorFormResult } from '../../../utils/types';
	import { getCurrentStrategicPlanStore } from '../../../states/strategic_plan_state';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Button } from '$lib/components/ui/button';
	import FormSection from './FormSection.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { onMount } from 'svelte';
	import { fetchSdgAlignments, fetchYearlyPlans } from '../../../utils/page_load';

	//props
	interface Iprops {
		indicator: Tables<'strategy_plan_performance_indicator'>;
		isDrawerOpen: boolean;
	}

	let { indicator, isDrawerOpen = $bindable() }: Iprops = $props();
	//stores

	const { currentPerformanceIndicators, updatePerformanceIndicator } =
		getStrategyPerformanceIndicatorStore();
	const { updateForm } = getStrategyPerformanceIndicatorFormContext();
	const { objectives, currentStrategicPlan } = getCurrentStrategicPlanStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		resetForm: false,
		validators: zodClient(updateStrategyPlanPerformanceIndicatorSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentPerformanceIndicators.some(
					(indicator) =>
						indicator.performance_indicator.toLocaleLowerCase() ===
							form.data.performance_indicator.toLocaleLowerCase() && indicator.id !== form.data.id
				)
			) {
				setError(form, 'performance_indicator', 'Indicator already exists');
			}
			const action = result.data as FormResult<PerformanceIndicatorFormResult>;
			if (form.valid && action.performanceIndicator) {
				const performanceIndicator = action.performanceIndicator;
				updatePerformanceIndicator(performanceIndicator.id, performanceIndicator);
				showSuccessToast(`Succesfully updated strategy plan indicator `);
				isOpen = false;
				isDrawerOpen = false;
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset, errors } = form;
	//set data that is needed
	$formData.id = indicator.id;
	$formData.performance_indicator = indicator.performance_indicator;
	$formData.input_type = indicator.input_type;
	$formData.base_target = indicator.base_target;
	$formData.actual_target = indicator.actual_target;
	$formData.concerned_offices = indicator.concerned_offices;
	$formData.remarks = indicator.remarks;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error updating performance indicator: ${$message.text}`);
		}
	});

	//onmount for detching datas
	onMount(async () => {
		const { data: sdgAlignments } = await fetchSdgAlignments(indicator.id);
		currentSdg = sdgAlignments ?? []; // Set to empty array if data is null/undefined

		const { data: plans } = await fetchYearlyPlans(indicator.id);
		let tempYearlyPlan = plans || [];

		// Fill in missing years between start and end
		for (
			let year = $currentStrategicPlan!.strategic.start_year;
			year <= $currentStrategicPlan!.strategic.end_year;
			year++
		) {
			if (!tempYearlyPlan.some((plan: { year: number }) => plan.year === year)) {
				tempYearlyPlan.push({
					year,
					target: '',
					budget: 0
				});
			}
		}

		// Sort by year
		yearlyPlan = tempYearlyPlan.sort((a: { year: number }, b: { year: number }) => a.year - b.year);
	});
	//extra states
	//======================== SDG alignment ===========================//
	//types
	interface CurrentSdg {
		strat_plan_objective_id: string;
	}
	//states
	let currentSdg: CurrentSdg[] = $state([]);
	let availableObjectives = $derived.by(() =>
		$objectives.filter(
			(objective) => !currentSdg.some((sdg) => sdg.strat_plan_objective_id === objective.id)
		)
	);
	//effect to save to form
	$effect(() => {
		$formData.sdg_alignments = currentSdg;
	});
	//===================== YEARLY Plan ========================//
	interface YearlyPlan {
		id: string;
		year: number;
		target: string;
		budget: number;
	}

	let yearlyPlan: YearlyPlan[] = $state([]);

	$effect(() => {
		$formData.yearly_plans = yearlyPlan;
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
			<Dialog.Title>Update Performance Indicator</Dialog.Title>
			<Dialog.Description>
				An indicator is a measurable criterion used to assess the performance and success of a
				specific task or objective, aligning efforts with organizational goals.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateindicator" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
			<FormSection title={'Basic Information *'}>
				<div>
					<Form.Field {form} name="performance_indicator">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Performance Indicator</Form.Label>
								<IntelligentInput
									textAreaWidth={'full'}
									placeholder="Provide performance indicator"
									bind:content={$formData.performance_indicator}
									name={props.name}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
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
				<div class=" grid gap-2 md:grid-cols-2">
					<Form.Field {form} name="base_target">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Base Traget</Form.Label>
								<Input
									placeholder={'Add base target...'}
									{...props}
									bind:value={$formData.base_target}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="actual_target">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Actual Target</Form.Label>
								<Input
									placeholder={'Add actual target...'}
									{...props}
									bind:value={$formData.actual_target}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			</FormSection>
			<FormSection title={'Additional Information'}>
				<Form.Field {form} name="concerned_offices">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Concerned Offices</Form.Label>
							<Input
								placeholder={'Concerned Offices...'}
								{...props}
								bind:value={$formData.concerned_offices}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
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
			</FormSection>
			<h1 class="text-sm font-medium">SDG Alginments</h1>
			{#each currentSdg as sdg, index}
				<div class="flex items-center gap-4">
					<div class="flex-1">
						<Select.Root
							type="single"
							name="sdg"
							onValueChange={(value) => {
								currentSdg[index] = { ...currentSdg[index], strat_plan_objective_id: value };
							}}
						>
							<Select.Trigger
								class="flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm hover:bg-gray-50"
							>
								<span class="text-gray-700">
									{#if currentSdg[index]?.strat_plan_objective_id}
										{$objectives.find(
											(objective) => objective.id === currentSdg[index]?.strat_plan_objective_id
										)?.objective ?? 'Select SDG'}
									{:else}
										Select SDG
									{/if}
								</span>
							</Select.Trigger>
							<Select.Content class="rounded-md border bg-white shadow-lg">
								<Select.Group>
									<Select.GroupHeading class="px-2 py-1.5 text-sm font-semibold text-gray-900"
									></Select.GroupHeading>
									{#each $objectives.filter((objective) => !currentSdg.some((sdg) => sdg.strat_plan_objective_id === objective.id)) as objective}
										<Select.Item
											value={objective.id}
											label={objective.objective}
											class="cursor-pointer px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
										>
											{objective.objective}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>
					<Button
						variant="ghost"
						class="w-fit hover:bg-gray-100"
						onclick={() => {
							currentSdg.splice(index, 1);
							currentSdg = currentSdg;
						}}
					>
						<Trash2 size="16" color="#dc2626" />
					</Button>
				</div>
			{:else}
				<h1 class="text-gray-500 text-sm text-center">No SDG alignments attached</h1>
			{/each}
			<Button
				variant="outline"
				disabled={availableObjectives.length <= 0}
				class="mt-4 w-full border-dashed"
				onclick={() => {
					currentSdg = [...currentSdg, { strat_plan_objective_id: '' }];
				}}
			>
				<Plus size="16" class="mr-2" />
				Add SDG Alignment
			</Button>
			{#if $errors.sdg_alignments}
				{#if $errors.sdg_alignments && $errors.sdg_alignments._errors}
					<p class="mt-1 text-center text-sm text-red-500">{$errors.sdg_alignments._errors[0]}</p>
				{/if}
			{/if}

			<h1 class="text-sm font-medium">Yearly Plans</h1>
			{#each yearlyPlan as plan, index}
				<div>
					<h1>Year plan for <span class=" text-sm font-medium">{plan.year}</span></h1>
					<div class="grid gap-2 md:grid-cols-2">
						<div>
							<Input type="text" bind:value={plan.target} placeholder={`Target for ${plan.year}`} />
							{#if $errors.yearly_plans?.[index]?.target}
								<p class="mt-1 text-sm text-red-500">
									{$errors.yearly_plans?.[index]?.target}
								</p>
							{/if}
						</div>
						<div>
							<Input
								type="number"
								step="0.01"
								bind:value={plan.budget}
								placeholder={`Budget for ${plan.year}`}
							/>
							{#if $errors.yearly_plans?.[index]?.budget}
								<p class="mt-1 text-sm text-red-500">
									{$errors.yearly_plans?.[index]?.budget}
								</p>
							{/if}
						</div>
					</div>
				</div>
			{/each}
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
