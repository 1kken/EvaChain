<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil, Save } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { getAccomplishmentActivityFormContext } from '../../../states/activity_form_state';
	import { getAccomplishmentActivityStore } from '../../../states/activity_state';
	import { updateAccomplishmentActivitySchema } from '../../../schema/activity_schema';
	import type { ActivityFormResult } from '../../../utils/type';
	import type { Tables } from '$lib/types/database.types';

	//props
	interface Iprops {
		activity: Tables<'accomplishment_activity'>;
		isDrawerOpen: boolean;
	}

	let { activity, isDrawerOpen = $bindable() }: Iprops = $props();

	//stores
	const { updateForm } = getAccomplishmentActivityFormContext();
	const { updateAccomplishmentActivity, currentAccomplishmentActivities } =
		getAccomplishmentActivityStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateAccomplishmentActivitySchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentAccomplishmentActivities.some(
					(activity) => activity.activity === form.data.activity && activity.id !== form.data.id
				)
			) {
				setError(form, 'activity', 'Activity already exists');
			}
			const action = result.data as FormResult<ActivityFormResult>;
			if (form.valid && action.accActivity) {
				const activity = action.accActivity;
				updateAccomplishmentActivity(activity.id, activity);
				showSuccessToast(`successfully added Activity`);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: {
						...activity
					},
					newState: {
						...activity
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	// //set data that is needed
	$formData = { ...activity };

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding activity to the annual plan: ${$message.text}`);
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
			<Dialog.Title>Update Activity</Dialog.Title>
			<Dialog.Description>
				Activties are the tasks that are to be carried out in the annual plan.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateactivity" method="POST" use:enhance class="space-y-6">
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
