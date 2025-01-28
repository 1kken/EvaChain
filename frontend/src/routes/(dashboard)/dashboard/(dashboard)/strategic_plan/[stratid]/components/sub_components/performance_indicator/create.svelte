<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import SuperDebug, { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { Input } from '$lib/components/ui/input';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { browser } from '$app/environment';
	import { getStrategyPerformanceIndicatorStore } from '../../../states/performance_indicator_state';
	import { getStrategyPerformanceIndicatorFormContext } from '../../../states/performance_indicator_form_state';
	import { createStrategyPlanPerformanceIndicatorSchema } from '../../../schema/performance_indicator_schema';
	import type { PerformanceIndicatorFormResult } from '../../../utils/types';
	import { onMount } from 'svelte';
	import type { Tables } from '$lib/types/database.types';
	import { getCurrentStrategicPlanStore } from '../../../states/strategic_plan_state';

	//props
	interface Iprops {
		strategyPlanId: string;
		isExpanded: boolean;
		onToggle: () => Promise<void>;
	}

	let { strategyPlanId, isExpanded = $bindable(), onToggle }: Iprops = $props();
	//stores
	const { currentPerformanceIndicators, addPerformanceIndicator, size } =
		getStrategyPerformanceIndicatorStore();
	const { createForm } = getStrategyPerformanceIndicatorFormContext();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(createForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(createStrategyPlanPerformanceIndicatorSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentPerformanceIndicators.some(
					(indicator) =>
						indicator.performance_indicator.toLocaleLowerCase() ===
						form.data.performance_indicator.toLocaleLowerCase()
				)
			) {
				setError(form, 'performance_indicator', 'Indicator already exists');
			}
			const action = result.data as FormResult<PerformanceIndicatorFormResult>;
			if (form.valid && action.performanceIndicator) {
				const performanceIndicator = action.performanceIndicator;
				addPerformanceIndicator(performanceIndicator);
				showSuccessToast(`Succesfully added strategy plan indicator `);
				isOpen = false;
				isExpanded = false;
				reset({
					data: {
						...form.data
					},
					newState: {
						...form.data
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	$formData.strategy_plan_id = strategyPlanId;
	$formData.position = $size + 1;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding dpcr function indicator: ${$message.text}`);
		}
	});

	//extra states
	//======================== SDG alignment && Year ===========================//
	//types
	interface CurrentSdg {
		strat_plan_id: string;
	}
	//context
	const { yearCount, currentStrategicPlan } = getCurrentStrategicPlanStore();
	//states
	const sdg: Tables<'strat_plan_objective'>[] = $state([]);
	const currentSdg: CurrentSdg[] = $state([]);
	onMount(async () => {});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none" id="nav-2">
		<span class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			<span class=" md:inline">Add Performance Indicator</span>
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Add Performance Indicator</Dialog.Title>
			<Dialog.Description>
				An indicator is a measurable criterion used to assess the performance and success of a
				specific task or objective, aligning efforts with organizational goals.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createindicator" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input hidden name="strategy_plan_id" value={$formData.strategy_plan_id} />
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
