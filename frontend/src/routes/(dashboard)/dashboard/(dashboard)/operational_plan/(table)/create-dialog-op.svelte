<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Plus } from 'lucide-svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import {
		type SuperValidated,
		type Infer,
		superForm,
		type FormResult
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import {
		createOperationalPlanSchema,
		type CreateOperationalPlanSchema
	} from '../(data)/operational_plan_schema';
	import { getOperationalPlanStore } from '../(data)/operational_plan_state.svelte';
	import type { OPFormResult } from '../(data)/types';
	import { getAuthStore } from '$lib/utils/authStore';
	import { checkProfileCompletion } from '$lib/utils/missingDetailsToast';
	import IncompleteProfileDialog from './incomplete-profile-dialog.svelte';

	let { data }: { data: SuperValidated<Infer<CreateOperationalPlanSchema>> } = $props();

	const { addOperationalPlan } = getOperationalPlanStore();
	const { currentProfile } = getAuthStore();

	let isOpen = $state(false);
	const form = superForm(data, {
		validators: zodClient(createOperationalPlanSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<OPFormResult>;
			if (form.valid && action.opData) {
				const operationalPlan = action.opData;
				addOperationalPlan(operationalPlan);
				showSuccessToast(`Succesfully added core function ${operationalPlan.title}`);
				isOpen = false;
			}
		}
	});

	const { form: formData, enhance, message, delayed, reset } = form;
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
				data: { title: `Operational Plan ${year}`, implementing_unit: '' },
				newState: { title: `Operational Plan ${year}`, implementing_unit: '' }
			});
		}

		if ($message?.status == 'error') {
			showErrorToast($message.text);
			reset({
				data: { title: `Operational Plan ${year}`, implementing_unit: '' },
				newState: { title: `Operational Plan ${year}`, implementing_unit: '' }
			});
		}
	});
	$formData.title = `Operational Plan ${year}`;
</script>

{#if !completeProfile}
	<IncompleteProfileDialog errors={errorMessage} />
{:else}
	<Dialog.Root bind:open={isOpen}>
		<Dialog.Trigger class={buttonVariants({ variant: 'default' })}
			><Plus /> Create Operational Plan</Dialog.Trigger
		>
		<Dialog.Content class="sm:max-w-auto">
			<Dialog.Header>
				<Dialog.Title>Operational Plan</Dialog.Title>
				<Dialog.Description>
					A detailed document outlining the specific actions, activities, timelines, and resources
					required to achieve the goals and objectives of an organization within a defined period,
					typically aligned with its strategic plan.
				</Dialog.Description>
			</Dialog.Header>
			<form action="?/createop" method="POST" use:enhance>
				<Form.Field {form} name="title">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Title</Form.Label>
							<Input {...props} bind:value={$formData.title} />
						{/snippet}
					</Form.Control>
					<Form.Description
						>A descriptive name automatically inferred from the year of creation, typically
						reflecting the plan's timeframe (e.g., "Operational Plan 2024").</Form.Description
					>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="implementing_unit">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Implementing Unit</Form.Label>
							<Input {...props} bind:value={$formData.implementing_unit} />
						{/snippet}
					</Form.Control>
					<Form.Description
						>A division or entity responsible for executing and managing the activities outlined in
						an operational plan to achieve organizational goals.</Form.Description
					>
					<Form.FieldErrors />
				</Form.Field>
				<div class="grid grid-cols-1 md:grid-cols-1">
					<Form.Field {form} name="head_of_planning">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Head of Institutional Planning and Futures Thinking</Form.Label>
								<Input
									{...props}
									bind:value={$formData.head_of_planning}
									placeholder="Juan D. Cruz"
								/>
							{/snippet}
						</Form.Control>
						<Form.Description>
							The head of the department responsible for developing and implementing the
						</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="head_of_operating_unit">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Head of Operating Unit</Form.Label>
								<Input
									{...props}
									bind:value={$formData.head_of_operating_unit}
									placeholder="Juan D. Cruz"
								/>
							{/snippet}
						</Form.Control>
						<Form.Description>
							The name of the person in charge of the operating unit.
						</Form.Description>
						<Form.FieldErrors />
					</Form.Field>
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
