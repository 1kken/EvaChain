<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Save } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { getAccomplishmentActivityFormContext } from '../../../states/activity_form_state';
	import { getAccomplishmentActivityStore } from '../../../states/activity_state';
	import { createAccomplishmentActivitySchema } from '../../../schema/activity_schema';
	import type { ActivityFormResult } from '../../../utils/type';
	//props
	interface Iprops {
		annualPlanId: string;
		isExpanded: boolean;
		onToggle: () => Promise<void>;
	}

	let { annualPlanId, isExpanded = $bindable(), onToggle }: Iprops = $props();

	//stores
	const { createForm } = getAccomplishmentActivityFormContext();
	const { size, addAccomplishmentActivity, currentAccomplishmentActivities } =
		getAccomplishmentActivityStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(createForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(createAccomplishmentActivitySchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentAccomplishmentActivities.some(
					(activity) => activity.activity === form.data.activity
				)
			) {
				setError(form, 'activity', 'Activity already exists');
			}
			const action = result.data as FormResult<ActivityFormResult>;
			if (form.valid && action.accActivity) {
				const activity = action.accActivity;
				addAccomplishmentActivity(activity);
				showSuccessToast(`successfully added Activity`);
				isOpen = false;
				isExpanded = true;
				reset({
					data: {
						accomplishment_annual_plan_id: activity.accomplishment_annual_plan_id,
						position: $size + 1
					},
					newState: {
						accomplishment_annual_plan_id: activity.accomplishment_annual_plan_id,
						position: $size + 1
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	// //set data that is needed
	$formData.accomplishment_annual_plan_id = annualPlanId;
	$formData.position = $size + 1;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding activity to the annual plan: ${$message.text}`);
		}
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class=" focus-visible:outline-none" id="nav-2">
		<span class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			<span class="hidden md:inline">Add Activity</span>
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Add Activity</Dialog.Title>
			<Dialog.Description>
				Activties are the tasks that are to be carried out in the annual plan.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createactivity" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input
				hidden
				name="accomplishment_annual_plan_id"
				value={$formData.accomplishment_annual_plan_id}
			/>
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
