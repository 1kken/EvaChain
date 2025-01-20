<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import SuperDebug, { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { getOpAnnualPlanFormContext } from '../../../states/op_annual_plan_form_state';
	import { getOpAnnualPlanStore } from '../../../states/op_annual_plan_state';
	import { createOpAnnualPlanSchema } from '../../../schema/op_annual_plan_schema';
	import type { OpAnnualPlanFormResult } from '../../../utils/type';

	//props
	interface Iprops {
		opHeaderId: string;
		isExpanded: boolean;
		onToggle: () => Promise<void>;
	}
	let { opHeaderId, onToggle, isExpanded = $bindable() }: Iprops = $props();

	//stores
	const { createForm } = getOpAnnualPlanFormContext();
	const { size, addOpAnnualPlan, currentOpAnnualPlans } = getOpAnnualPlanStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(createForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(createOpAnnualPlanSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentOpAnnualPlans.some(
					(opAnnualPlan) => opAnnualPlan.description === form.data.description
				)
			) {
				setError(form, 'description', 'Annual plan already exists');
			}
			const action = result.data as FormResult<OpAnnualPlanFormResult>;
			if (form.valid && action.opAnnualPlan) {
				const opAnnualPlan = action.opAnnualPlan;
				addOpAnnualPlan(opAnnualPlan);
				showSuccessToast(`Successfully added ${opAnnualPlan.description}`);
				isOpen = false;
				isExpanded = true;
				reset({
					data: { op_header_id: opAnnualPlan.op_header_id, position: $size + 1 },
					newState: {
						op_header_id: opAnnualPlan.op_header_id,
						position: $size + 1
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	// //set data that is needed
	$formData.op_header_id = opHeaderId;
	$formData.position = $size + 1;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding operational header: ${$message.text}`);
		}
	});
</script>

<Dialog.Root bind:open={isOpen} onOpenChange={onToggle}>
	<Dialog.Trigger class="focus-visible:outline-none" id="nav-2">
		<span class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			<span class="hidden md:inline">Add Annual Plan</span>
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
		<form action="?/createopannualplan" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input hidden name="op_header_id" value={$formData.op_header_id} />
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
