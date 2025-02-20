<script lang="ts">
	import type { Tables } from '$lib/types/database.types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SuperDebug, { fileProxy, superForm, type FormResult } from 'sveltekit-superforms';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { LoaderCircle, Save } from 'lucide-svelte';
	import { Pencil } from 'lucide-svelte';
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
	import { onMount } from 'svelte';
	import { getIpcrAccomplishmentFormContext } from '../../../../states/ipcr_indicator_accomplishment_form_state';
	import { getIpcrAccomplishmentStore } from '../../../../states/ipcr_indicator_accomplishment_state';
	import { updateAccomplishmentSchema } from '../../../../schema/ipcr_indicator_accomplishmet';
	import type { IPCRAccomplishmentFormResult } from '../../../../utils/types';
	import { getIpcrIndicatorEvidence } from './helper';
	import { Input } from '$lib/components/ui/input';

	interface Props {
		accomplishment: Tables<'ipcr_indicator_accomplishment'>; // Updated table name
		opIndicator: Tables<'op_header_indicators'>;
	}

	//evidence

	let { accomplishment, opIndicator }: Props = $props();

	// stores
	const { updateForm } = getIpcrAccomplishmentFormContext();
	const { updateAccomplishment } = getIpcrAccomplishmentStore();

	// state
	let isOpen = $state(false);
	const form = superForm(updateForm, {
		validators: zodClient(updateAccomplishmentSchema),
		multipleSubmits: 'prevent',
		id: crypto.randomUUID(),
		onUpdate({ form, result }) {
			const action = result.data as FormResult<IPCRAccomplishmentFormResult>;
			if (form.valid && action.ipcrAccomplishment) {
				const accomplishment = action.ipcrAccomplishment;
				updateAccomplishment(accomplishment.id, accomplishment);
				showSuccessToast(`Succesfully updated accomplishment`);
				reset({
					data: {
						...accomplishment
					},
					newState: {
						...accomplishment
					}
				});
				isOpen = false;
			}
		}
	});

	const { form: formData, enhance, message, delayed, reset } = form;

	const evidenceProxy = fileProxy(form, 'pdf_evidence');

	//get the File from the signedUrl File in this context is the blob
	async function getFileFromEvidence(signedUrl: string): Promise<File> {
		const response = await fetch(signedUrl);
		const blob = await response.blob();
		const filename = signedUrl.split('?')[0].split('/').pop() || 'evidence';
		return new File([blob], filename, { type: 'application/pdf' });
	}

	onMount(() => {
		getIpcrIndicatorEvidence(accomplishment.id)
			.then((evidence) => {
				if (evidence.signedUrl) {
					getFileFromEvidence(evidence.signedUrl)
						.then((file) => {
							const dataTransfer = new DataTransfer();
							dataTransfer.items.add(file);
							$evidenceProxy = dataTransfer.files;
						})
						.catch((e) => {
							showErrorToast(`Error getting file from evidence: ${e}`);
						});
				}
			})
			.catch((e) => {
				showErrorToast(`Error fetching evidence ${e}`);
			});
	});

	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error editing accomplishment ${$message.text}`);
		}
	});
	const df = new DateFormatter('en-US', { dateStyle: 'long' });

	// Initialize form data
	$formData.id = accomplishment.id;
	// Initialize date value
	let dateValue = $state<DateValue | undefined>();
	if (accomplishment.accomplishment_date) {
		dateValue = parseDate(accomplishment.accomplishment_date);
	}
	let placeholder = $state<DateValue>(today(getLocalTimeZone()));

	function onFileSelectAndHover(files: File[]) {
		const dataTransfer = new DataTransfer();
		files.forEach((file) => dataTransfer.items.add(file));
		const fileList = dataTransfer.files;
		$evidenceProxy = fileList;
	}

	//set Data
	$effect(() => {
		$formData.accomplishment_date = accomplishment.accomplishment_date || '';
		$formData.actual_accomplishments = accomplishment.actual_accomplishments || '';
		$formData.quantity = accomplishment.quantity || '';
		$formData.input_type = opIndicator.input_type || 'text';
		$formData.accomplishment_date = accomplishment.accomplishment_date || '';
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="rounded-full p-1.5 hover:bg-gray-100">
		<Pencil class="h-4 w-4 " />
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Mark Indicator As Done</Dialog.Title>
			<Dialog.Description>
				Extra information about the indicator.
				<br />
				Operational Plan Indicator: {opIndicator.performance_indicator}
			</Dialog.Description>
		</Dialog.Header>
		<form
			method="POST"
			action="?/updateaccomplishment"
			use:enhance
			class="space-y-6"
			enctype="multipart/form-data"
		>
			<input hidden name="id" value={$formData.id} />
			<input hidden name="input_type" value={$formData.input_type} />
			<Form.Field {form} name="actual_accomplishments">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Accomplishment</Form.Label>
						<IntelligentInput
							textAreaWidth={'full'}
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
							oldFile={$evidenceProxy[0]}
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
					<Form.Button disabled class="w-full"
						><LoaderCircle class="animate-spin" />Processing...</Form.Button
					>
				{:else}
					<Form.Button class="w-full"><Save />Save</Form.Button>
				{/if}
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
