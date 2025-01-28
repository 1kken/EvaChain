<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { GripHorizontal, Info, Plus, Trash2 } from 'lucide-svelte';
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
		createStrategicPlanSchema,
		type CreateStratPlanSchema
	} from '../(data)/strat_plan_schema';
	import { getStrategicPlanStore } from '../(data)/strat_plan_state';
	import type { StrategicFormResult } from '../(data)/types';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { browser } from '$app/environment';
	import { Item } from '$lib/components/ui/carousel';

	let { data }: { data: SuperValidated<Infer<CreateStratPlanSchema>> } = $props();

	//Stores
	const { addPlan, isOutputAvailable } = getStrategicPlanStore();
	const { currentProfile } = getAuthStore();

	const currentYear = Number(new Date().getFullYear());

	//state
	let isOpen = $state(false);
	interface Objectives {
		id: number;
		objective: string;
		position: number;
	}
	let objectives: Objectives[] = $state([]);
	//variables
	const flipDurationMs = 300;
	const form = superForm(data, {
		validators: zodClient(createStrategicPlanSchema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<StrategicFormResult>;
			if (form.valid && action.stratPlan) {
				const stratPlan = action.stratPlan;
				addPlan(stratPlan);
				showSuccessToast(`Succesfully added strategic plan ${stratPlan.title}`);
				isOpen = false;
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
		if ($message?.status == 'success') {
			showSuccessToast($message.text);
			isOpen = false;
			reset({
				data: {
					title: `Strategic plan - ${year}`,
					goal: '',
					major_output: 'instruction',
					objectives: []
				},
				newState: {
					title: `Strategic plan - ${year}`,
					goal: '',
					major_output: 'instruction',
					objectives: []
				}
			});
		}

		if ($message?.status == 'error') {
			showErrorToast($message.text);
		}

		$formData.objectives = objectives;
	});
	//set data
	$formData.title = `Strategic Plan ${year}`;
	$formData.start_year = currentYear;
	$formData.end_year = currentYear + 5;

	//helpers
	function addObjective() {
		objectives.push({ id: objectives.length, objective: '', position: objectives.length });
	}

	function removeObjective(id: number) {
		objectives = objectives.filter((objective) => objective.id !== id);
	}

	function handleDndConsider(e: CustomEvent<DndEvent<Objectives>>) {
		objectives = e.detail.items.map((item, index) => ({
			...item,
			position: index
		}));
	}

	function handleDndFinalize(e: CustomEvent<DndEvent<Objectives>>) {
		objectives = e.detail.items.map((item, index) => ({
			...item,
			position: index
		}));
	}
	const outputs = ['instruction', 'research', 'extension', 'governance_and_management'] as const;
	const someOutputAvailable = outputs.some((output) => isOutputAvailable(output, year));
</script>

{#if !completeProfile}
	<IncompleteProfile errors={errorMessage} />
{:else if !someOutputAvailable}
	<Button disabled variant="outline"
		><Info size="16" /> Already Included all Major Output/ PPA this year</Button
	>
{:else}
	<Dialog.Root bind:open={isOpen}>
		<Dialog.Trigger class={buttonVariants({ variant: 'default' })}
			><Plus /> Create Strategic Plan</Dialog.Trigger
		>
		<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[500px]">
			<Dialog.Header>
				<Dialog.Title>Strategic Plan</Dialog.Title>
				<Dialog.Description>
					A strategic function drives an organization’s long-term goals, aligns priorities, and
					ensures growth and competitiveness.
				</Dialog.Description>
			</Dialog.Header>
			<form action="?/createstrategicplan" method="POST" use:enhance>
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
