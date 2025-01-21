<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { LoaderCircle } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { type SuperValidated, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast, showWarningToast } from '$lib/utils/toast';
	import { Pencil } from 'lucide-svelte';
	import { getAccomplishmentReportStore } from '../(data)/accomp_state';
	import {
		updateAccomplishmentReportSchema,
		type UpdateAccomplishmentReportInput
	} from '../(data)/accomp_schema';
	import type { AccFormResult } from '../(data)/types';

	let {
		updateForm,
		id,
		dropDownOpen = $bindable()
	}: {
		updateForm: SuperValidated<UpdateAccomplishmentReportInput>;
		id: string;
		dropDownOpen?: boolean;
	} = $props();

	const { updateAccomplishmentReport, currentUserAccomplishmentReport } =
		getAccomplishmentReportStore();

	let isOpen = $state(false);
	const form = superForm(updateForm, {
		validators: zodClient(updateAccomplishmentReportSchema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<AccFormResult>;
			if (form.valid && action.accData) {
				const accData = action.accData;
				updateAccomplishmentReport(accData.id, accData);
				showSuccessToast(`Successfully updated accomplishment report ${accData.title}`);
				closeAllTabs();
				reset({
					data: {
						id: accData.id,
						title: accData.title,
						implementing_unit: accData.implementing_unit
					},
					newState: {
						id: accData.id,
						title: accData.title,
						implementing_unit: accData.implementing_unit
					}
				});
			}
		}
	});

	const { form: formData, enhance, message, delayed, reset } = form;
	const currentAccReport = $currentUserAccomplishmentReport.find((acc) => acc.id === id);
	$formData.id = id;
	$formData.title = currentAccReport?.title ?? 'error';
	$formData.implementing_unit = currentAccReport?.implementing_unit ?? 'error';
	$formData.review_by = currentAccReport?.review_by ?? '';
	$formData.reviewer_position = currentAccReport?.reviewer_position ?? '';
	$formData.approve_by = currentAccReport?.approve_by ?? '';
	$formData.approver_position = currentAccReport?.approver_position ?? '';

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
	<Dialog.Trigger class="focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} /> Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-auto">
		<Dialog.Header>
			<Dialog.Title>Update Accomplishment Report</Dialog.Title>
			<Dialog.Description>
				Edit the details of your accomplishment report to accurately reflect your unit's
				achievements and progress.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateaccreport" method="POST" use:enhance>
			<Form.Field {form} name="title">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Title</Form.Label>
						<Input {...props} bind:value={$formData.title} />
					{/snippet}
				</Form.Control>
				<Form.Description>
					A descriptive name for your accomplishment report, typically including the reporting
					period (e.g., "Accomplishment Report 2024").
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
					The unit or department responsible for the activities and achievements detailed in this
					report.
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
				<Form.Button disabled><LoaderCircle class="animate-spin" />Processing...</Form.Button>
			{:else}
				<Form.Button>Submit</Form.Button>
			{/if}
		</form>
	</Dialog.Content>
</Dialog.Root>
