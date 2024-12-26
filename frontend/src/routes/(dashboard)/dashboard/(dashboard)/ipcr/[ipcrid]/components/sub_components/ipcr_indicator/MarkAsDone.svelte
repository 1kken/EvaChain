<script lang="ts">
	import type { Tables } from '$lib/types/database.types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SuperDebug, { fileProxy, superForm, type FormResult } from 'sveltekit-superforms';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Grid2x2Check, LoaderCircle } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';
	import DragAndDropFileWrapper from '$lib/custom_components/DragAndDropFilesWrapper/DragAndDropFileWrapper.svelte';
	import { getIpcrIndicatorFormContext } from '../../../states/ipcr_indicator_form_state';
	import { getIpcrIndicatorStore } from '../../../states/ipcr_indicator_state';
	import { markIndicatorDoneSchema } from '../../../schema/ipcr_indicator_schema';
	import type { IPCRFunctionIndicatorFormResult } from '../../../utils/types';

	interface Props {
		indicator: Tables<'ipcr_indicator'>; // Updated table name
		isDrawerOpen: boolean;
	}

	let { indicator, isDrawerOpen = $bindable() }: Props = $props();

	// stores
	const { markDoneForm } = getIpcrIndicatorFormContext();
	const { updateIpcrIndicator } = getIpcrIndicatorStore();

	// state
	let isOpen = $state(false);
	const form = superForm(markDoneForm, {
		validators: zodClient(markIndicatorDoneSchema),
		multipleSubmits: 'prevent',
		id: indicator.id,
		onUpdate({ form, result }) {
			const action = result.data as FormResult<IPCRFunctionIndicatorFormResult>;
			if (form.valid && action.ipcrFunctionIndicator) {
				const indicator = action.ipcrFunctionIndicator;
				updateIpcrIndicator(indicator.id, indicator);
				showSuccessToast(`Indicator marked as done!`);
				isOpen = false;
				isDrawerOpen = false;
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
	$formData.id = indicator.id;
	// Initialize date value
	let dateValue = $state<DateValue | undefined>();
	if (indicator.accomplishment_date) {
		dateValue = parseDate(indicator.accomplishment_date);
	}
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
	<Dialog.Trigger class="focus-visible:outline-none">
		<span class="flex items-center gap-3 text-sm">
			<Grid2x2Check size={16} /> Mark as Done
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="w-11/12 sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Mark Indicator As Done</Dialog.Title>
			<Dialog.Description>
				Target indicator: {indicator.success_indicator}
			</Dialog.Description>
		</Dialog.Header>
		<form
			method="POST"
			action="?/markipcrindicatordone"
			use:enhance
			class="space-y-6"
			enctype="multipart/form-data"
		>
			<input hidden name="id" value={$formData.id} />
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
											$formData.accomplishment_date = v.toString();
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
