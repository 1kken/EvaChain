<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { BookOpen, ChevronDown, NotepadTextDashed, Plus, Save } from 'lucide-svelte';
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
	import { getOperationalPlansStore } from '../(data)/operational_plan_state.svelte';
	import type { OPFormResult } from '../(data)/types';
	import { getAuthStore } from '$lib/utils/authStore';
	import { checkProfileCompletion } from '$lib/utils/missingDetailsToast';
	import IncompleteProfileDialog from './incomplete-profile-dialog.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';

	let { data }: { data: SuperValidated<Infer<CreateOperationalPlanSchema>> } = $props();

	const { addOperationalPlan } = getOperationalPlansStore();
	const { currentProfile } = getAuthStore();
	const { currentOperationalPlans } = getOperationalPlansStore();

	let isOpen = $state(false);
	let isDrawerOpen = $state(false);
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
				isDrawerOpen = false;
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
			isDrawerOpen = false;
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
	<DropDownWrapper
		childrens={$currentOperationalPlans.length > 0 ? [blankTemplate, withPast] : [blankTemplate]}
		bind:isDrawerOpen
		icon={ChevronDown}
		text={'Create Options'}
		extraClass="w-44"
	/>
{/if}

{#snippet blankTemplate()}
	<!---BLANK TEMPLATE-->
	<Dialog.Root bind:open={isOpen}>
		<Dialog.Trigger class={buttonVariants({ variant: 'ghost' })}
			><BookOpen /> Blank Template</Dialog.Trigger
		>
		<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[500px]">
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
							<Input
								{...props}
								bind:value={$formData.implementing_unit}
								placeholder="Office of the vice president, Sout La Unio..."
							/>
						{/snippet}
					</Form.Control>
					<Form.Description
						>A division or entity responsible for executing and managing the activities outlined in
						an operational plan to achieve organizational goals.</Form.Description
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
{/snippet}

{#snippet withPast()}
	<Dialog.Root bind:open={isOpen}>
		<Dialog.Trigger class={buttonVariants({ variant: 'ghost' })}
			><NotepadTextDashed /> Use Previous
		</Dialog.Trigger>
		<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[500px]">
			<Dialog.Header>
				<Dialog.Title>Operational Plan</Dialog.Title>
				<Dialog.Description>
					A detailed document outlining the specific actions, activities, timelines, and resources
					required to achieve the goals and objectives of an organization within a defined period,
					typically aligned with its strategic plan.
				</Dialog.Description>
			</Dialog.Header>
			<form action="?/createop&usePrevious=true" method="POST" use:enhance>
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
							<Input
								{...props}
								bind:value={$formData.implementing_unit}
								placeholder="Office of the vice president, Sout La Unio..."
							/>
						{/snippet}
					</Form.Control>
					<Form.Description
						>A division or entity responsible for executing and managing the activities outlined in
						an operational plan to achieve organizational goals.</Form.Description
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
{/snippet}
