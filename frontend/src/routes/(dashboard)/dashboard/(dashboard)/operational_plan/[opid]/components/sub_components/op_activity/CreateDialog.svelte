<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Save } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { getOpActivityFormContext } from '../../../states/op_activity_form_state';
	import { getOpActivityStore } from '../../../states/op_activity_state';
	import { createOpActivitySchema } from '../../../schema/op_activity_schema';
	import type { OpActivityFormResult } from '../../../utils/type';

	//props
	interface Iprops {
		opAnnualPlanId: string;
		isExpanded: boolean;
		onToggle: () => Promise<void>;
	}

	let { opAnnualPlanId, isExpanded = $bindable(), onToggle }: Iprops = $props();

	//stores
	const { createForm } = getOpActivityFormContext();
	const { size, addOpActivity, currentOpActivities } = getOpActivityStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(createForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(createOpActivitySchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentOpActivities.some(
					(opActivity) => opActivity.activity.toLowerCase() === form.data.activity.toLowerCase()
				)
			) {
				setError(form, 'activity', 'Activity already exists');
			}
			const action = result.data as FormResult<OpActivityFormResult>;
			if (form.valid && action.opActivity) {
				const opActivity = action.opActivity;
				addOpActivity(opActivity);
				showSuccessToast(`successfully added Activity`);
				isOpen = false;
				isExpanded = true;
				reset({
					data: { op_annual_plan_id: opActivity.op_annual_plan_id, position: $size + 1 },
					newState: {
						op_annual_plan_id: opActivity.op_annual_plan_id,
						position: $size + 1
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	// //set data that is needed
	$formData.op_annual_plan_id = opAnnualPlanId;
	$formData.position = $size + 1;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding activity to the objective: ${$message.text}`);
		}
	});
</script>

<Dialog.Root bind:open={isOpen} onOpenChange={onToggle}>
	<Dialog.Trigger class=" focus-visible:outline-none" id="nav-2">
		<span class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			<span class="hidden md:inline">Add Activity</span>
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Add Objectives & Activities</Dialog.Title>
			<Dialog.Description>
				Program/Project Objective: A concise statement outlining the goals and intended outcomes of
				the program or project.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createopactivity" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input hidden name="op_annual_plan_id" value={$formData.op_annual_plan_id} />
			<Form.Field {form} name="activity">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Activity</Form.Label>
						<IntelligentInput
							textAreaWidth={'full'}
							placeholder="Enter the activity for the program/project."
							bind:content={$formData.activity}
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
