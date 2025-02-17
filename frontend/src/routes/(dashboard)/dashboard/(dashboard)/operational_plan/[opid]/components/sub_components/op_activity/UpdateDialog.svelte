<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Save } from 'lucide-svelte';
	import { Pencil } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import type { OpActivityFormResult } from '../../../utils/type';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { getOpActivityFormContext } from '../../../states/op_activity_form_state';
	import { getOpActivityStore } from '../../../states/op_activity_state';
	import { updateOpActivitySchema } from '../../../schema/op_activity_schema';
	import type { Tables } from '$lib/types/database.types';

	//props
	interface Iprops {
		opActivity: Tables<'op_activity'>;
		isDrawerOpen: boolean;
	}
	let { opActivity, isDrawerOpen = $bindable() }: Iprops = $props();

	//stores
	const { updateForm } = getOpActivityFormContext();
	const { updateOpActivity, currentOpActivities } = getOpActivityStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateOpActivitySchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentOpActivities.some(
					(opActivity) =>
						opActivity.activity.toLowerCase() === form.data.activity?.toLowerCase() &&
						opActivity.id !== form.data.id // Changed from activity to id
				)
			) {
				setError(form, 'activity', 'Activity already exists');
			}
			const action = result.data as FormResult<OpActivityFormResult>;
			if (form.valid && action.opActivity) {
				const opActivity = action.opActivity;
				updateOpActivity(opActivity.id, opActivity);
				showSuccessToast(`successfully updated Activity to the Objective`);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: { ...opActivity },
					newState: {
						...opActivity
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	// //set data that is needed
	$formData.id = opActivity.id;
	$formData.activity = opActivity.activity;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding activity to the objective: ${$message.text}`);
		}
	});

	//for total
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} />Edit
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
		<form action="?/updateopactivity" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
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
