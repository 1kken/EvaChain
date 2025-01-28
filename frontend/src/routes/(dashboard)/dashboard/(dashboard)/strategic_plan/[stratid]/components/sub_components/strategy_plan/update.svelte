<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import AutoCompleteOfflineInput from '$lib/custom_components/AutoCompleteOfflineInput.svelte';
	import { getCurrentStrategicPlanStore } from '../../../states/strategic_plan_state';
	import { getStrategyPlanFormContext } from '../../../states/strategy_plan_form_state';
	import { getStrategyPlanStore } from '../../../states/strategy_plan_state';
	import {
		createStrategyPlanSchema,
		updateStrategyPlanSchema
	} from '../../../schema/strategy_plan_schema';
	import type { StrategyPlanFormResult } from '../../../utils/types';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import type { Tables } from '$lib/types/database.types';

	interface Iprops {
		strategyPlan: Tables<'strategy_plan'>;
		isDrawerOpen: boolean;
	}

	let { strategyPlan, isDrawerOpen = $bindable() }: Iprops = $props();

	//stores
	const { updateForm } = getStrategyPlanFormContext();
	const { currentStrategyPlans, updateStrategyPlan } = getStrategyPlanStore();
	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateStrategyPlanSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentStrategyPlans.some(
					(strat) =>
						strat.description.toLocaleLowerCase().trim() ===
							form.data.description.toLocaleLowerCase().trim() && strat.id !== form.data.id
				)
			) {
				setError(form, 'description', 'Strategy plan already exist');
			}
			const action = result.data as FormResult<StrategyPlanFormResult>;
			if (form.valid && action.strategyPlan) {
				const strategyPlan = action.strategyPlan;
				updateStrategyPlan(strategyPlan.id, strategyPlan);
				showSuccessToast(`Succesfully updated strategy plan ${strategyPlan.description}`);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: { ...strategyPlan },
					newState: { ...strategyPlan }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	$formData.id = strategyPlan.id;
	$formData.description = strategyPlan.description;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding strategic plan: ${$message.text}`);
			isDrawerOpen = false;
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
			<Dialog.Title>Update Strategy Plan</Dialog.Title>
			<Dialog.Description>
				A strategy plan outlines goals, actions, and metrics to achieve long-term success.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updatestrategyplan" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
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
