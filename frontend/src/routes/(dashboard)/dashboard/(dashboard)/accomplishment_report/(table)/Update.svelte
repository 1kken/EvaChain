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
	$formData.head_of_operating_unit = currentAccReport?.head_of_operating_unit ?? 'error';

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
				<Form.Description>The name of the person in charge of the operating unit.</Form.Description>
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
