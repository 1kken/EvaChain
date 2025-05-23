<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Plus, LoaderCircle, Save } from 'lucide-svelte';
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
	import type { AccFormResult } from '../(data)/types';
	import { getAuthStore } from '$lib/utils/authStore';
	import { checkProfileCompletion } from '$lib/utils/missingDetailsToast';
	import IncompleteProfileDialog from './Incomplete.svelte';
	import { getAccomplishmentReportStore } from '../(data)/accomp_state';
	import {
		createAccomplishmentReportSchema,
		type CreateAccomplishmentReportSchema
	} from '../(data)/accomp_schema';

	let {
		data,
		isAddDrawerOpen = $bindable()
	}: { data: SuperValidated<Infer<CreateAccomplishmentReportSchema>>; isAddDrawerOpen: boolean } =
		$props();

	const { currentUserAccomplishmentReport, addAccomplishmentReport } =
		getAccomplishmentReportStore();
	const { currentProfile } = getAuthStore();

	let isOpen = $state(false);
	const form = superForm(data, {
		validators: zodClient(createAccomplishmentReportSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<AccFormResult>;
			if (form.valid && action.accData) {
				const accData = action.accData;
				addAccomplishmentReport(accData);
				showSuccessToast(`Successfully added accomplishment report ${accData.title}`);
				isOpen = false;
				isAddDrawerOpen = false;
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
				data: { title: `Accomplishment Report ${year}`, implementing_unit: '' },
				newState: { title: `Accomplishment Report ${year}`, implementing_unit: '' }
			});
		}

		if ($message?.status == 'error') {
			showErrorToast($message.text);
			reset({
				data: { title: `Accomplishment Report ${year}`, implementing_unit: '' },
				newState: { title: `Accomplishment Report ${year}`, implementing_unit: '' }
			});
		}
	});

	$formData.title = `Accomplishment Report ${year}`;
</script>

{#if !completeProfile}
	<IncompleteProfileDialog errors={errorMessage} />
{:else}
	<Dialog.Root bind:open={isOpen}>
		<Dialog.Trigger class={buttonVariants({ variant: 'default' })}
			><Plus /> Create Accomplishment Report</Dialog.Trigger
		>
		<Dialog.Content class="sm:max-w-auto">
			<Dialog.Header>
				<Dialog.Title>Accomplishment Report</Dialog.Title>
				<Dialog.Description>
					An Accomplishment Report documents achievements, outcomes, and progress made during a
					specific period, highlighting key performance indicators and successful initiatives.
				</Dialog.Description>
			</Dialog.Header>
			<form action="?/createaccreport" method="POST" use:enhance>
				<Form.Field {form} name="title">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Title</Form.Label>
							<Input {...props} bind:value={$formData.title} />
						{/snippet}
					</Form.Control>
					<Form.Description>
						A descriptive name automatically inferred from the year of creation, typically
						reflecting the reporting period (e.g., "Accomplishment Report 2024").
					</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="implementing_unit">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Implementing Unit</Form.Label>
							<Input {...props} bind:value={$formData.implementing_unit} />
						{/snippet}
					</Form.Control>
					<Form.Description>
						The unit, department, or division responsible for the activities and achievements being
						reported.
					</Form.Description>
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
{/if}
