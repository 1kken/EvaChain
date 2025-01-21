<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import SuperDebug, { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { getAccomplishmentAnnualPlanFormContext } from '../../../states/annual_plan_form_state';
	import { getAccomplishmentAnnualPlanStore } from '../../../states/annual_plan_state';
	import { updateAccomplishmentAnnualPlanSchema } from '../../../schema/annual_plan_schema';
	import type { AnnualPlanFormResult } from '../../../utils/type';
	import type { Tables } from '$lib/types/database.types';

	//props
	interface Iprops {
		accAnnualPlan: Tables<'accomplishment_annual_plan'>;
		isDrawerOpen: boolean;
	}
	let { accAnnualPlan, isDrawerOpen = $bindable() }: Iprops = $props();

	//stores
	const { updateForm } = getAccomplishmentAnnualPlanFormContext();
	const { updateAccomplishmentAnnualPlan, currentAccomplishmentAnnualPlans } =
		getAccomplishmentAnnualPlanStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateAccomplishmentAnnualPlanSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentAccomplishmentAnnualPlans.find(
					(plan) => plan.description === form.data.description && plan.id !== form.data.id
				)
			) {
				setError(form, 'description', 'Annual plan already exists');
			}
			const action = result.data as FormResult<AnnualPlanFormResult>;
			if (form.valid && action.accAnnualPlan) {
				const accAnnualPlan = action.accAnnualPlan;
				updateAccomplishmentAnnualPlan(accAnnualPlan.id, accAnnualPlan);
				showSuccessToast(`Successfully added ${accAnnualPlan.description}`);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: { id: accAnnualPlan.id, description: accAnnualPlan.description },
					newState: {
						id: accAnnualPlan.id,
						description: accAnnualPlan.description
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	// //set data that is needed
	$formData.id = accAnnualPlan.id;
	$formData.description = accAnnualPlan.description;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding annual plan: ${$message.text}`);
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
			<Dialog.Title>Add Annual Plans</Dialog.Title>
			<Dialog.Description>
				Annual plan is a detailed plan of the objectives and activities that will be carried out in
				a year.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateannualplan" method="POST" use:enhance class="space-y-6">
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
				<Form.Button disabled><LoaderCircle class="animate-spin" />Processing...</Form.Button>
			{:else}
				<Form.Button>Submit</Form.Button>
			{/if}
		</form>
	</Dialog.Content>
</Dialog.Root>
