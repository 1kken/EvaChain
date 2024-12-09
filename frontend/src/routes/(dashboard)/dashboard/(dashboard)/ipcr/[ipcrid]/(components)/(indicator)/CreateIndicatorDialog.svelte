<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import SuperDebug, { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { getIndicatorFormContext } from '../(data)/indicator_form.svelte';
	import { createIndicatorSchema } from '../(data)/indicator_schema';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import { browser } from '$app/environment';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { getIndicatorStore } from '../(data)/indicator_state.svelte';
	import type { indicatorFormResult } from '../(data)/types';
	import Indicator from '../(body)/(core_function)/Indicator.svelte';
	import { showSuccessToast } from '$lib/utils/toast';
	import { handleIndicatorConfig } from './utils';

	interface IndicatorConfig {
		type: 'core_function' | 'sub_core_function';
		id: string;
	}

	//config
	let { config }: { config: IndicatorConfig } = $props();
	let isOpen = $state(false);

	//stores
	const indicatorStore = getIndicatorStore();
	const { currentIndicators } = indicatorStore;

	const { createIndicatorForm: data } = getIndicatorFormContext();
	const form = superForm(data, {
		validators: zodClient(createIndicatorSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<indicatorFormResult>;
			if (form.valid && action.indicatorData && indicatorStore) {
				const indicator = action.indicatorData;
				indicatorStore.addIndicator(indicator);
				showSuccessToast(`Succesfully added indicator!`);
				isOpen = false;
				const resetConfig = handleIndicatorConfig(configType, config);
				reset(resetConfig);
			}
		}
	});
	//form
	const { form: formData, enhance, reset } = form;
	//procces by config
	const size = $currentIndicators.filter(
		(i) => i.sub_core_function_id === config.id || i.core_function_id === config.id
	).length;
	$formData.position = (size + 1) * 100;

	const configType = config.type;
	if (configType === 'core_function') {
		$formData.core_function_id = config.id;
	}

	if (configType === 'sub_core_function') {
		$formData.sub_core_function_id = config.id;
	}

	// $formData.position = (size + 1) * 100;

	function handleDialogOpenChange(open: boolean) {
		isOpen = open;
	}
</script>

<Dialog.Root bind:open={isOpen} onOpenChange={handleDialogOpenChange}>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
		<span class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			<span class="hidden md:inline">Add Indicator</span>
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Create Indicator</Dialog.Title>
			<Dialog.Description>
				An indicator is a measurable criterion used to assess the performance and success of a
				specific task or objective, aligning efforts with organizational goals.
			</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/createindicator" use:enhance class="space-y-6">
			<input type="hidden" name="sub_core_function_id" value={$formData.sub_core_function_id} />
			<input type="hidden" name="position" value={$formData.position} />
			<input type="hidden" name="core_function_id" value={$formData.core_function_id} />

			<Form.Field {form} name="indicator">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Indicator</Form.Label>
						<IntelligentInput
							placeholder={'Please type your indicator'}
							bind:content={$formData.indicator}
						/>
						<Form.Description>Please fill up the following field.</Form.Description>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="flex justify-end">
				<Form.Button>Submit</Form.Button>
			</div>
		</form>
		{#if browser}
			<SuperDebug data={$formData} />
		{/if}
	</Dialog.Content>
</Dialog.Root>
