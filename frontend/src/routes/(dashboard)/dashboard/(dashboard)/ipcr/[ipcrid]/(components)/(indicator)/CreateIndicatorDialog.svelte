<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import SuperDebug, { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { getIndicatorFormContext } from '../(data)/(forms)/indicator_form.svelte';
	import { createIndicatorSchema } from '../../utils/schemas/indicator_schema';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { getIndicatorStore } from '../(data)/(state)/indicator_state.svelte';
	import type { indicatorFormResult } from '../(data)/types';
	import { showSuccessToast } from '$lib/utils/toast';
	import { handleIndicatorConfig } from './utils';
	import { browser } from '$app/environment';

	interface IndicatorConfig {
		type:
			| 'core_function'
			| 'sub_core_function'
			| 'support_function'
			| 'sub_support_function'
			| 'other_function'
			| 'sub_other_function';
		id: string;
	}

	//config
	let {
		config,
		isDirectChild = false,
		isDrawerOpen = $bindable()
	}: { config: IndicatorConfig; isDirectChild?: boolean; isDrawerOpen?: boolean } = $props();
	let isOpen = $state(false);

	//stores
	const indicatorStore = getIndicatorStore();
	const { currentIndicators } = indicatorStore;

	const { createIndicatorForm: data } = getIndicatorFormContext();
	const form = superForm(data, {
		validators: zodClient(createIndicatorSchema),
		multipleSubmits: 'prevent',
		id: Date.now().toString(),
		onUpdate({ form, result }) {
			const action = result.data as FormResult<indicatorFormResult>;
			if (form.valid && action.indicatorData && indicatorStore) {
				const indicator = action.indicatorData;
				indicatorStore.addIndicator(indicator);
				showSuccessToast(`Succesfully added indicator!`);
				isOpen = false;
				isDrawerOpen = false;
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

	if (configType === 'support_function') {
		$formData.support_function_id = config.id;
	}

	if (configType === 'sub_support_function') {
		$formData.sub_support_function_id = config.id;
	}

	if (configType === 'other_function') {
		$formData.other_function_id = config.id;
	}

	if (configType === 'sub_other_function') {
		$formData.sub_other_function_id = config.id;
	}

	function handleDialogOpenChange(open: boolean) {
		isOpen = open;
	}

	$formData.indicator = '';
</script>

<Dialog.Root bind:open={isOpen} onOpenChange={handleDialogOpenChange}>
	{#if isDirectChild}
		<Dialog.Trigger class="focus-visible:outline-none">
			<span class="flex items-center gap-3">
				<Plus size={16} /> Add indicator
			</span>
		</Dialog.Trigger>
	{:else}
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
			<span class="flex items-center gap-2">
				<Plus class="h-5 w-5" />
				<span class="hidden md:inline">Add Indicator</span>
			</span>
		</Dialog.Trigger>
	{/if}
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Create Indicator</Dialog.Title>
			<Dialog.Description>
				An indicator is a measurable criterion used to assess the performance and success of a
				specific task or objective, aligning efforts with organizational goals.
			</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/createindicator" use:enhance class="space-y-6">
			<input type="hidden" name="position" value={$formData.position} />
			<input type="hidden" name="core_function_id" value={$formData.core_function_id} />
			<input type="hidden" name="sub_core_function_id" value={$formData.sub_core_function_id} />
			<input type="hidden" name="support_function_id" value={$formData.support_function_id} />
			<input
				type="hidden"
				name="sub_support_function_id"
				value={$formData.sub_support_function_id}
			/>
			<input type="hidden" name="other_function_id" value={$formData.other_function_id} />
			<Form.Field {form} name="indicator">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Indicator</Form.Label>
						<IntelligentInput
							name="indicator"
							placeholder={'Please type your indicator'}
							bind:content={$formData.indicator!}
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
