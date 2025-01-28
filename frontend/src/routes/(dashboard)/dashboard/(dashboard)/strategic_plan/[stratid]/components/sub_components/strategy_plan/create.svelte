<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import SuperDebug, { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import AutoCompleteOfflineInput from '$lib/custom_components/AutoCompleteOfflineInput.svelte';
	import { getCurrentStrategicPlanStore } from '../../../states/strategic_plan_state';
	import { getStrategyPlanFormContext } from '../../../states/strategy_plan_form_state';
	import { getStrategyPlanStore } from '../../../states/strategy_plan_state';
	import { createStrategyPlanSchema } from '../../../schema/strategy_plan_schema';
	import type { StrategyPlanFormResult } from '../../../utils/types';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { browser } from '$app/environment';

	//stores
	const { currentStrategicPlan } = getCurrentStrategicPlanStore();
	const { createForm } = getStrategyPlanFormContext();
	const { currentStrategyPlans, addStrategyPlan, size } = getStrategyPlanStore();
	//states
	let isOpen = $state(false);

	//form
	const form = superForm(createForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(createStrategyPlanSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentStrategyPlans.some(
					(strat) =>
						strat.description.toLocaleLowerCase().trim() ===
						form.data.description.toLocaleLowerCase().trim()
				)
			) {
				setError(form, 'description', 'Strategy plan already exist');
			}
			const action = result.data as FormResult<StrategyPlanFormResult>;
			if (form.valid && action.strategyPlan) {
				const strategyPlan = action.strategyPlan;
				addStrategyPlan(strategyPlan);
				showSuccessToast(`Succesfully added strategy plan ${strategyPlan.description}`);
				isOpen = false;
				reset({
					data: { strat_plan_id: strategyPlan.strat_plan_id, position: $size + 1 },
					newState: { strat_plan_id: strategyPlan.strat_plan_id, position: $size + 1 }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	if ($currentStrategicPlan) {
		$formData.strat_plan_id = $currentStrategicPlan.id;
		$formData.position = $size + 1;
	}

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding strategic plan: ${$message.text}`);
		}
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none" id="nav-2">
		<span class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			<span class="hidden md:inline">Add Strategy Plan</span>
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Add Strategy Plan</Dialog.Title>
			<Dialog.Description>
				A strategy plan outlines goals, actions, and metrics to achieve long-term success.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createstrategyplan" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input hidden name="strat_plan_id" value={$formData.strat_plan_id} />
			<Form.Field {form} name="description">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Description</Form.Label>
						<IntelligentInput
							textAreaWidth={'full'}
							placeholder="Enter the description for the strategy plan"
							bind:content={$formData.description}
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
	</Dialog.Content>
</Dialog.Root>
