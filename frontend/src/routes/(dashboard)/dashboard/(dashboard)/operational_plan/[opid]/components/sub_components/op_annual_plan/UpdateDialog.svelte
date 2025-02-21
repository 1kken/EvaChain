<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil, Save } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { getOpAnnualPlanFormContext } from '../../../states/op_annual_plan_form_state';
	import { getOpAnnualPlanStore } from '../../../states/op_annual_plan_state';
	import { updateOpAnnualPlanSchema } from '../../../schema/op_annual_plan_schema';
	import type { OpAnnualPlanFormResult } from '../../../utils/type';
	import type { Tables } from '$lib/types/database.types';

	//props
	interface Iprops {
		opAnnualPlan: Tables<'op_annual_plan'>;
		isDrawerOpen: boolean;
	}
	let { opAnnualPlan, isDrawerOpen = $bindable() }: Iprops = $props();

	//stores
	const { updateForm } = getOpAnnualPlanFormContext();
	const { updateOpAnnualPlan, currentOpAnnualPlans } = getOpAnnualPlanStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateOpAnnualPlanSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentOpAnnualPlans.some(
					(opAnnualPlan) =>
						opAnnualPlan.description === form.data.description &&
						opAnnualPlan.id !== opAnnualPlan.id
				)
			) {
				setError(form, 'description', 'Annual plan already exists');
			}
			const action = result.data as FormResult<OpAnnualPlanFormResult>;
			if (form.valid && action.opAnnualPlan) {
				const opAnnualPlan = action.opAnnualPlan;
				updateOpAnnualPlan(opAnnualPlan.id, opAnnualPlan);
				showSuccessToast(`Successfully added ${opAnnualPlan.description}`);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: { id: opAnnualPlan.id, description: opAnnualPlan.description },
					newState: {
						id: opAnnualPlan.id,
						description: opAnnualPlan.description
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	// //set data that is needed
	$formData.id = opAnnualPlan.id;
	$formData.description = opAnnualPlan.description;
	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding operational header: ${$message.text}`);
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
			<Dialog.Title>Edit Annual Plan</Dialog.Title>
			<Dialog.Description>
				Annual plan is a detailed plan of the objectives and activities that will be carried out in
				a year.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateopannualplan" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
			<Form.Field {form} name="description">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Description</Form.Label>
						<IntelligentInput
							textAreaWidth={'full'}
							placeholder="Enter the description of the Annual Plan"
							bind:content={$formData.description}
							name={props.name}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			{#if $delayed}
				<Form.Button disabled class="w-full"
					><LoaderCircle class="animate-spin" />Processing...</Form.Button
				>
			{:else}
				<Form.Button class="w-full"><Save />Save</Form.Button>
			{/if}
		</form>
	</Dialog.Content>
</Dialog.Root>
