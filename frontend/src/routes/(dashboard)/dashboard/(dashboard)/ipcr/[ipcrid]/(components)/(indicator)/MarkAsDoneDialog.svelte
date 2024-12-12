<script lang="ts">
	import type { Tables } from '$lib/types/database.types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { getIndicatorFormContext } from '../(data)/(forms)/indicator_form.svelte';
	import {
		markIndicatorDoneSchema,
		updateIndicatorSchema
	} from '../../utils/schemas/indicator_schema';
	import SuperDebug, { superForm, type FormResult } from 'sveltekit-superforms';
	import type { indicatorFormResult } from '../(data)/types';
	import { getIndicatorStore } from '../(data)/(state)/indicator_state.svelte';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Grid2x2Check } from 'lucide-svelte';
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
	import { browser } from '$app/environment';

	interface Props {
		indicator: Tables<'indicator'>;
		isDrawerOpen: boolean;
	}

	let { indicator, isDrawerOpen = $bindable() }: Props = $props();

	// stores
	const { markIndicatorDoneForm } = getIndicatorFormContext();
	const indicatorStore = getIndicatorStore();

	// state
	let isOpen = $state(false);
	const form = superForm(markIndicatorDoneForm, {
		validators: zodClient(markIndicatorDoneSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<indicatorFormResult>;
			if (form.valid && action.indicatorData && indicatorStore) {
				const indicator = action.indicatorData;
				indicatorStore.updateIndicator(indicator.id, indicator);
				showSuccessToast(`Indicator mark as done!`);
				isOpen = false;
				isDrawerOpen = false;
				const { id, accomplishment, accomplishment_date } = indicator;
				if (accomplishment && accomplishment_date) {
					reset({
						data: { id, accomplishment, accomplishment_date },
						newState: { id, accomplishment, accomplishment_date }
					});
				}
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
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger
		class="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-green-100 hover:text-green-700 focus-visible:outline-none"
	>
		<Grid2x2Check size={16} />
		<span>Mark as Done</span>
	</Dialog.Trigger>
	<Dialog.Content class="w-[95vw] max-w-5xl">
		<Dialog.Header>
			<Dialog.Title>Edit Indicator</Dialog.Title>
			<Dialog.Description>
				Update the indicator details and accomplishment information
			</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/markindicatordone" use:enhance class="space-y-6">
			<div class="grid grid-cols-1 gap-4">
				<input hidden name="id" value={$formData.id} />
				<Form.Field {form} name="accomplishment">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Accomplishment</Form.Label>
							<IntelligentInput
								name="accomplishment"
								placeholder={'Please type your accomplishment'}
								bind:content={$formData.accomplishment!}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="grid grid-cols-1 gap-4">
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
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="flex justify-end">
				<Form.Button>Save</Form.Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
