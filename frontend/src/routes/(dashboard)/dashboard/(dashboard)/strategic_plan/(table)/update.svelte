<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { GripHorizontal, Pencil, Plus, Trash2 } from 'lucide-svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import SuperDebug, {
		type SuperValidated,
		type Infer,
		superForm,
		type FormResult
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { checkProfileCompletion } from '$lib/utils/missingDetailsToast';
	import { getAuthStore } from '$lib/utils/authStore';
	import IncompleteProfile from './incompleteProfile.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import {
		updateStrategicPlanSchema,
		type UpdateStratPlanInput,
		type UpdateStratPlanSchema
	} from '../(data)/strat_plan_schema';
	import { getStrategicPlanStore } from '../(data)/strat_plan_state';
	import type { StrategicFormResult } from '../(data)/types';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { Tables } from '$lib/types/database.types';
	import { onMount } from 'svelte';
	import { fetchObjectives } from '../(data)/helper';

	let {
		updateForm,
		id,
		dropDownOpen = $bindable()
	}: {
		updateForm: SuperValidated<UpdateStratPlanInput>;
		id: string;
		dropDownOpen?: boolean;
	} = $props();

	//Stores
	const { updatePlan, isOutputAvailable, currentPlans } = getStrategicPlanStore();
	const { currentProfile } = getAuthStore();

	//state
	let isOpen = $state(false);
	let objectives: Tables<'strat_plan_objective'>[] = $state([]);

	//onmount
	onMount(async () => {
		objectives = await fetchObjectives(id);
	});

	//variables
	const flipDurationMs = 300;
	const form = superForm(updateForm, {
		validators: zodClient(updateStrategicPlanSchema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<StrategicFormResult>;
			if (form.valid && action.stratPlan) {
				const stratPlan = action.stratPlan;
				console.log(stratPlan.id);
				updatePlan(stratPlan.id, stratPlan);
				showSuccessToast(`Succesfully updated strategic plan ${stratPlan.title}`);
				isOpen = false;
				dropDownOpen = false;
			}
		}
	});

	const { form: formData, enhance, message, delayed, reset, errors } = form;
	const year = new Date().getFullYear();
	let completeProfile = $state(true);
	let errorMessage = $state<string | null>();

	$effect(() => {
		if ($currentProfile === null) return;
		const errormessage = checkProfileCompletion($currentProfile);
		if (errormessage) {
			completeProfile = false;
			errorMessage = errormessage;
		} else {
			completeProfile = true;
			errorMessage = null;
		}

		if ($message?.status == 'error') {
			showErrorToast($message.text);
			isOpen = false;
			dropDownOpen = false;
		}

		$formData.objectives = objectives;
	});

	$formData.title = `Strategic Plan ${year}`;

	const currentStratPlan = $currentPlans.find((stratPlan) => stratPlan.id === id);

	if (currentStratPlan) {
		$formData.id = currentStratPlan.id;
		$formData.goal = currentStratPlan.goal ?? '';
		$formData.major_output = currentStratPlan.major_output;
		$formData.title = currentStratPlan.title;
		$formData.start_year = currentStratPlan.start_year;
		$formData.end_year = currentStratPlan.end_year;
	}

	//helpers
	function addObjective() {
		const now = new Date().toISOString();
		let newObjective = {
			id: crypto.randomUUID(),
			strategic_plan_id: currentStratPlan!.id,
			objective: '',
			position: objectives.length,
			created_at: now,
			updated_at: now
		};
		objectives.push({ ...newObjective });
	}

	function removeObjective(id: string) {
		objectives = objectives.filter((objective) => objective.id !== id);
	}

	function handleDndConsider(e: CustomEvent<DndEvent<Tables<'strat_plan_objective'>>>) {
		objectives = e.detail.items.map((item, index) => ({
			...item,
			position: index
		}));
	}

	function handleDndFinalize(e: CustomEvent<DndEvent<Tables<'strat_plan_objective'>>>) {
		objectives = e.detail.items.map((item, index) => ({
			...item,
			position: index
		}));
	}
</script>

{#if !completeProfile}
	<IncompleteProfile errors={errorMessage} />
{:else}
	<Dialog.Root bind:open={isOpen}>
		<Dialog.Trigger class=" focus-visible:outline-none">
			<span class="flex items-center gap-3">
				<Pencil size={16} /> Edit
			</span>
		</Dialog.Trigger>
		<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[500px]">
			<Dialog.Header>
				<Dialog.Title>Strategic Plan</Dialog.Title>
				<Dialog.Description>
					A strategic function drives an organization’s long-term goals, aligns priorities, and
					ensures growth and competitiveness.
				</Dialog.Description>
			</Dialog.Header>
			<form action="?/updatestrategicplan" method="POST" use:enhance>
				<input hidden name="id" value={$formData.id} />
				<Form.Field {form} name="title">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Title</Form.Label>
							<Input {...props} bind:value={$formData.title} />
						{/snippet}
					</Form.Control>
					<Form.Description
						>A descriptive name automatically inferred from the year of creation, typically
						reflecting the plan's timeframe (e.g., "Strategic Plan 2024").</Form.Description
					>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="goal">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Goal</Form.Label>
							<IntelligentInput
								textAreaWidth={'full'}
								placeholder="Enter the goal of the Strategic plan"
								bind:content={$formData.goal}
								name={props.name}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="major_output">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Major output/ PPA</Form.Label>
							<Select.Root type="single" bind:value={$formData.major_output} name={props.name}>
								<Select.Trigger {...props} class="capitalize">
									{$formData.major_output === null
										? 'Please select appropriate Major Output /PPA'
										: $formData.major_output === 'governance_and_management'
											? 'Governance and Management'
											: $formData.major_output}
								</Select.Trigger>
								<Select.Content>
									{#if isOutputAvailable('instruction', year)}
										<Select.Item value="instruction" label="Instruction" />
									{/if}
									{#if isOutputAvailable('research', year)}
										<Select.Item value="research" label="Research" />
									{/if}
									{#if isOutputAvailable('extension', year)}
										<Select.Item value="extension" label="Extension" />
									{/if}

									{#if isOutputAvailable('governance_and_management', year)}
										<Select.Item
											value="governance_and_management"
											label="Governance and Management"
										/>
									{/if}
								</Select.Content>
							</Select.Root>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
					<Form.Field {form} name="start_year">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Start Year</Form.Label>
								<Input {...props} type="number" bind:value={$formData.start_year} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="end_year">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>End Year</Form.Label>
								<Input {...props} type="number" bind:value={$formData.end_year} />
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="mb-2 flex flex-col gap-2 rounded border p-4 text-center">
					{#if objectives.length === 0}
						<p class="text-gray-500">No objectives added yet</p>
					{:else}
						<h2>Objective</h2>
					{/if}
					<div
						class="flex flex-col gap-4"
						use:dndzone={{
							items: objectives,
							flipDurationMs,
							dropAnimationDisabled: true,
							dropTargetStyle: { outline: `rgba(102, 204, 255, 0.7) solid 2px` }
						}}
						onconsider={handleDndConsider}
						onfinalize={handleDndFinalize}
					>
						{#each objectives as objective (objective.id)}
							<div class="flex items-center gap-4">
								<GripHorizontal size="16" />
								<div class="flex-1">
									<Input type="text" bind:value={objective.objective} placeholder="Objective" />
									{#if $errors.objectives?.[objective.id]?.objective}
										<p class="mt-1 text-sm text-red-500">
											{$errors.objectives[objective.id].objective}
										</p>
									{/if}
								</div>

								<Button variant="ghost" class="w-fit" onclick={() => removeObjective(objective.id)}>
									<Trash2 size="16" color="#dc2626" />
								</Button>
							</div>
						{/each}
					</div>
					<Button variant="outline" class="border-dashed" onclick={addObjective}>
						<Plus size="16" />
						Add Objective
					</Button>
				</div>

				{#if $delayed}
					<Form.Button disabled><LoaderCircle class="animate-spin" />Processing...</Form.Button>
				{:else}
					<Form.Button>Submit</Form.Button>
				{/if}
			</form>
		</Dialog.Content>
	</Dialog.Root>
{/if}
