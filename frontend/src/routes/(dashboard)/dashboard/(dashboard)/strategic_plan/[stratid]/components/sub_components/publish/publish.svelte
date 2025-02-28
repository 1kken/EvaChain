<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Send } from 'lucide-svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { goto } from '$app/navigation';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import {
		superForm,
		type FormResult,
		type Infer,
		type SuperValidated
	} from 'sveltekit-superforms';
	import {
		publishStratPlanSchema,
		type PublishStratPlanSchema
	} from '../../../schema/publish_stat_plan_schema';
	import { getCurrentStrategicPlanStore } from '../../../states/strategic_plan_state';

	interface Props {
		publishForm: SuperValidated<Infer<PublishStratPlanSchema>>;
	}

	const { currentStrategicPlan } = getCurrentStrategicPlanStore();

	let { publishForm }: Props = $props();
	let isOpen = $state(false);

	//check if current ipcr is not null

	const form = superForm(publishForm, {
		validators: zodClient(publishStratPlanSchema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		invalidateAll: true,
		async onUpdate({ form, result }) {
			if (form.valid && result.type === 'success') {
				showSuccessToast('Strategic Plan published successfully');
				await goto('/dashboard/strategic_plan');
			}
		}
	});

	const { form: formData, message, enhance, delayed, reset } = form;

	$formData.id = $currentStrategicPlan?.strategic.id!;

	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast($message.text);
			isOpen = false;
		}
	});
</script>

<AlertDialog.Root bind:open={isOpen}>
	<AlertDialog.Trigger class="focus-visible:outline-none" id="nav-3">
		<span class="flex items-center gap-2">
			<Send class="h-5 w-5" />
			<span class="hidden md:inline">Publish Strategic Plan</span>
		</span>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				After publishing, the strategic plan will be available to all users. and can no longer be
				edited.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/publishstratplan" id="submit-ipcr" use:enhance>
			<Form.Field {form} name="id">
				<Form.Control>
					{#snippet children({ props })}
						<Input type="hidden" {...props} bind:value={$formData.id} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</form>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action type="submit" form="submit-ipcr">Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
