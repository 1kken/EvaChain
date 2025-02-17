<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { LoaderCircle, Save } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { type SuperValidated, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast, showWarningToast } from '$lib/utils/toast';
	import { Pencil } from 'lucide-svelte';
	import {
		updateOperationalPlanSchema,
		type UpdateOperationalPlanInput
	} from '../(data)/operational_plan_schema';
	import { getOperationalPlansStore } from '../(data)/operational_plan_state.svelte';
	import type { OPFormResult } from '../(data)/types';

	let {
		updateForm,
		id,
		dropDownOpen = $bindable()
	}: {
		updateForm: SuperValidated<UpdateOperationalPlanInput>;
		id: string;
		dropDownOpen?: boolean;
	} = $props();
	const { updateOperationalPlan, currentOperationalPlans } = getOperationalPlansStore();

	let isOpen = $state(false);
	const form = superForm(updateForm, {
		validators: zodClient(updateOperationalPlanSchema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<OPFormResult>;
			if (form.valid && action.opData) {
				const opData = action.opData;
				updateOperationalPlan(opData.id, opData);
				showSuccessToast(`Succesfully updated operational plan ${opData.title}`);
				closeAllTabs();
				reset({
					data: { id: opData.id, title: opData.title, implementing_unit: opData.implementing_unit },
					newState: {
						id: opData.id,
						title: opData.title,
						implementing_unit: opData.implementing_unit
					}
				});
			}
		}
	});

	const { form: formData, enhance, message, delayed, reset } = form;
	const currentOperationalPlan = $currentOperationalPlans.find((op) => op.id === id);
	$formData.id = id;
	$formData.title = currentOperationalPlan?.title ?? 'error';
	$formData.implementing_unit = currentOperationalPlan?.implementing_unit ?? 'error';
	$formData.review_by = currentOperationalPlan?.review_by ?? 'error';
	$formData.reviewer_position = currentOperationalPlan?.reviewer_position ?? 'error';
	$formData.approve_by = currentOperationalPlan?.approve_by ?? 'error';
	$formData.approver_position = currentOperationalPlan?.approver_position ?? 'error';

	function closeAllTabs() {
		isOpen = false;
		dropDownOpen = false;
	}
	$effect(() => {
		if ($message?.status == 'error') {
			showErrorToast($message.text);
			closeAllTabs();
		}

		if ($message?.status == 'warning') {
			showWarningToast($message.text);
			closeAllTabs();
		}
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class=" focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} /> Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title>Update Unit</Dialog.Title>
			<Dialog.Description>
				An operating in DMMMSU is a distinct section that performs specific functions to achieve
				university goals.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateop" method="POST" use:enhance>
			<Form.Field {form} name="title">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Title</Form.Label>
						<Input {...props} bind:value={$formData.title} />
					{/snippet}
				</Form.Control>
				<Form.Description
					>A descriptive name automatically inferred from the year of creation, typically reflecting
					the plan's timeframe (e.g., "Operational Plan 2024").</Form.Description
				>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="implementing_unit">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Implimenting Unit</Form.Label>
						<Input {...props} bind:value={$formData.implementing_unit} />
					{/snippet}
				</Form.Control>
				<Form.Description
					>A division or entity responsible for executing and managing the activities outlined in an
					operational plan to achieve organizational goals.</Form.Description
				>
				<Form.FieldErrors />
			</Form.Field>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Form.Field {form} name="review_by">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Reviewer</Form.Label>
							<Input {...props} bind:value={$formData.review_by} placeholder="Juan D. Cruz" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="reviewer_position">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Reviewer position</Form.Label>
							<Input
								{...props}
								bind:value={$formData.reviewer_position}
								placeholder="Head of Institutional Planning and Futures Thinking e.g..."
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Form.Field {form} name="approve_by">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Approver</Form.Label>
							<Input {...props} bind:value={$formData.approve_by} placeholder="Juan D. Cruz" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="approver_position">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Approver position</Form.Label>
							<Input
								{...props}
								bind:value={$formData.approver_position}
								placeholder="Chancellor, President, etc..."
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
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
