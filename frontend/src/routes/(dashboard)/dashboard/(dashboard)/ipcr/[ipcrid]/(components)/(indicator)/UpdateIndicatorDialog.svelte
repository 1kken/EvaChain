<script lang="ts">
	import type { Tables } from '$lib/types/database.types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { getIndicatorFormContext } from '../(data)/(forms)/indicator_form.svelte';
	import { updateIndicatorSchema } from '../../utils/schemas/indicator_schema';
	import { superForm, type FormResult } from 'sveltekit-superforms';
	import type { indicatorFormResult } from '../(data)/types';
	import { getIndicatorStore } from '../(data)/(state)/indicator_state.svelte';
	import { showSuccessToast } from '$lib/utils/toast';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Pencil } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { DateFormatter, type DateValue, parseDate } from '@internationalized/date';

	interface Props {
		indicator: Tables<'indicator'>;
		isDrawerOpen: boolean;
	}

	let { indicator, isDrawerOpen = $bindable() }: Props = $props();

	// stores
	const { updateIndicatorForm } = getIndicatorFormContext();
	const indicatorStore = getIndicatorStore();

	// state
	let isOpen = $state(false);
	const form = superForm(updateIndicatorForm, {
		validators: zodClient(updateIndicatorSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<indicatorFormResult>;
			if (form.valid && action.indicatorData && indicatorStore) {
				const indicator = action.indicatorData;
				indicatorStore.updateIndicator(indicator.id, indicator);
				showSuccessToast(`Successfully updated indicator!`);
				isOpen = false;
				isDrawerOpen = false;
			}
		}
	});

	const { form: formData, enhance, message, delayed } = form;
	const df = new DateFormatter('en-US', { dateStyle: 'long' });

	$formData.id = indicator.id;
	$formData.indicator = indicator.indicator ?? '';

	// Initialize date value
	let dateValue = $state<DateValue | undefined>();
	if (indicator.accomplishment_date) {
		dateValue = parseDate(indicator.accomplishment_date);
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} />Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="w-[95vw] max-w-5xl">
		<Dialog.Header>
			<Dialog.Title>Edit Indicator</Dialog.Title>
			<Dialog.Description>
				Update the indicator details and accomplishment information
			</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/updateindicator" use:enhance class="space-y-6">
			<div class="grid grid-cols-1 gap-4">
				<input hidden name="id" value={$formData.id} />
				<Form.Field {form} name="indicator">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Indicator</Form.Label>
							<IntelligentInput
								name="indicator"
								placeholder={'Please type your indicator'}
								bind:content={$formData.indicator!}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="grid grid-cols-1 gap-4"></div>
			<div class="flex justify-end">
				<Form.Button>Save</Form.Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
