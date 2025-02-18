<script lang="ts">
	import type { Tables } from '$lib/types/database.types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SuperDebug, { fileProxy, superForm, type FormResult } from 'sveltekit-superforms';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { LoaderCircle, Plus } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { DateFormatter, type DateValue, getLocalTimeZone, today } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';
	import DragAndDropFileWrapper from '$lib/custom_components/DragAndDropFilesWrapper/DragAndDropFileWrapper.svelte';
	import type { IPCRAccomplishmentFormResult } from '../../../../utils/types';
	import { getIpcrAccomplishmentFormContext } from '../../../../states/ipcr_indicator_accomplishment_form_state';
	import { getIpcrAccomplishmentStore } from '../../../../states/ipcr_indicator_accomplishment_state';
	import { createAccomplishmentSchema } from '../../../../schema/ipcr_indicator_accomplishmet';
	import { Input } from '$lib/components/ui/input';

	interface Props {
		indicator: Tables<'ipcr_indicator'>; // Updated table name
		opIndicator: Tables<'op_header_indicators'>;
		isOpen: boolean;
	}

	let { opIndicator, indicator, isOpen = $bindable() }: Props = $props();

	// stores
	const { createForm } = getIpcrAccomplishmentFormContext();
	const { addAccomplishment } = getIpcrAccomplishmentStore();

	// state
	const form = superForm(createForm, {
		validators: zodClient(createAccomplishmentSchema),
		multipleSubmits: 'prevent',
		id: crypto.randomUUID(),
		onUpdate({ form, result }) {
			const action = result.data as FormResult<IPCRAccomplishmentFormResult>;
			if (form.valid && action.ipcrAccomplishment) {
				const accomplishment = action.ipcrAccomplishment;
				addAccomplishment(accomplishment);
				showSuccessToast('Accomplishment added successfully');
				isOpen = false;
			}
		}
	});

	const { form: formData, enhance, message, delayed, reset } = form;
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error marking indicator as done ${$message.text}`);
		}
	});
	const df = new DateFormatter('en-US', { dateStyle: 'long' });

	// Initialize form data
	$formData.ipcr_indicator_id = indicator.id;
	$formData.input_type = opIndicator.input_type ?? 'text';

	// Initialize date value
	let dateValue = $state<DateValue | undefined>();
	let placeholder = $state<DateValue>(today(getLocalTimeZone()));

	const evidenceProxy = fileProxy(form, 'pdf_evidence');
	function onFileSelectAndHover(files: File[]) {
		const dataTransfer = new DataTransfer();
		files.forEach((file) => dataTransfer.items.add(file));
		const fileList = dataTransfer.files;
		$evidenceProxy = fileList;
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger
		class=" mb-1 w-full rounded-lg border border-dashed p-1 text-center hover:bg-green-200"
	>
		<span class="flex items-center justify-center space-x-2 text-center text-sm">
			<Plus size="16" /> Add Accomplishments
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Add accomplishment</Dialog.Title>
			<Dialog.Description>
				Extra information about the indicator.
				<br />
				Operational Plan Indicator: {opIndicator.performance_indicator}
			</Dialog.Description>
		</Dialog.Header>
		<form
			method="POST"
			action="?/createaccomplishment"
			use:enhance
			class="space-y-6"
			enctype="multipart/form-data"
		>
			<input hidden name="ipcr_indicator_id" value={$formData.ipcr_indicator_id} />
			<input hidden name="input_type" value={$formData.input_type} />
			<Form.Field {form} name="actual_accomplishments">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Accomplishment</Form.Label>
						<IntelligentInput
							name="actual_accomplishments"
							placeholder={'Please type your accomplishment'}
							bind:content={$formData.actual_accomplishments!}
						/>
						<Form.Description
							>Describe what you have accomplished for this indicator.</Form.Description
						>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="quantity">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label
							>Quantity <span class="text-sm text-gray-600"
								>current input type: {opIndicator.input_type}</span
							></Form.Label
						>
						<Input {...props} bind:value={$formData.quantity} />
					{/snippet}
				</Form.Control>
				<Form.Description
					>This is used to calculate the accomplishment data. Example input percentage: 2/2, 3/5 |
					Example input number: 2, 3 | Example input text: Done, Not Done | Example ratio: 2:2, 3:5
				</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<!-- Rest of the form remains the same -->
			<Form.Field {form} name="accomplishment_date">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Accomplishment Date</Form.Label>
						<Popover.Root>
							<Popover.Trigger
								class={cn(
									buttonVariants({ variant: 'outline' }),
									'w-full justify-start pl-4 text-left font-normal',
									!dateValue && 'text-muted-foreground'
								)}
							>
								{dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : 'Pick a date'}
								<CalendarIcon class="ml-auto size-4 opacity-50" />
							</Popover.Trigger>
							<Popover.Content class="w-auto p-0" side="top">
								<Calendar
									type="single"
									value={dateValue as DateValue}
									bind:placeholder
									maxValue={today(getLocalTimeZone())}
									calendarLabel="Accomplishment date"
									onValueChange={(v) => {
										dateValue = v;
										if (v) {
											const now = new Date();
											const date = new Date(v.toDate(getLocalTimeZone()));
											date.setHours(
												now.getHours(),
												now.getMinutes(),
												now.getSeconds(),
												now.getMilliseconds()
											);
											$formData.accomplishment_date = date.toISOString();
										} else {
											$formData.accomplishment_date = '';
										}
									}}
								/>
							</Popover.Content>
						</Popover.Root>
						<input hidden value={$formData.accomplishment_date} name={props.name} />
						<Form.Description>The date when the indicator was accomplished.</Form.Description>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="pdf_evidence">
				<Form.Control>
					{#snippet children({ props })}
						<DragAndDropFileWrapper
							onFileSelect={onFileSelectAndHover}
							name="pdf_evidence"
							text={'Upload PDF evidence'}
							role={'evidence_upload'}
							id={'pdf_evidence'}
							acceptedFileTypes={['application/pdf']}
						/>
						<input hidden type="file" bind:files={$evidenceProxy} name={props.name} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="flex w-full justify-end">
				{#if $delayed}
					<Form.Button disabled><LoaderCircle class="animate-spin" />Processing...</Form.Button>
				{:else}
					<Form.Button>Save</Form.Button>
				{/if}
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
