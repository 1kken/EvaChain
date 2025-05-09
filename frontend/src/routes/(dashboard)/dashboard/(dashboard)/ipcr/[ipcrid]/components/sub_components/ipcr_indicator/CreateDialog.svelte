<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Save } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import type { IPCRFunctionIndicatorFormResult } from '../../../utils/types';
	import { Input } from '$lib/components/ui/input';
	import AutoCompleteOnlineInput from '$lib/custom_components/AutoCompleteOnlineInput.svelte';
	import { fetchProfileById, fetchProfileByname } from '../../../utils/page_loader_services';
	import { getIpcrIndicatorFormContext } from '../../../states/ipcr_indicator_form_state';
	import { getIpcrIndicatorStore } from '../../../states/ipcr_indicator_state';
	import { createIpcrIndicatorSchema } from '../../../schema/ipcr_indicator_schema';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import { getAuthStore } from '$lib/utils/authStore';
	import OpIndicator from './OpIndicator.svelte';
	const { currentProfile } = getAuthStore();

	//props
	interface Iprops {
		ipcrFunctionId?: string;
		ipcrFunctionCategoryId?: string;
		ipcrFunctionSubCategoryId?: string;
		isDrawerOpen: boolean;
	}

	let {
		ipcrFunctionId,
		ipcrFunctionCategoryId,
		ipcrFunctionSubCategoryId,
		isDrawerOpen = $bindable()
	}: Iprops = $props();

	//stores
	const { createForm } = getIpcrIndicatorFormContext();
	const { currentIpcrIndicators, addIpcrIndicator, size } = getIpcrIndicatorStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(createForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(createIpcrIndicatorSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if ($currentIpcrIndicators.some((ind) => ind.final_output === form.data.final_output)) {
				setError(form, 'final_output', 'Output already exists');
			}
			if (
				$currentIpcrIndicators.some((ind) => ind.success_indicator === form.data.success_indicator)
			) {
				setError(form, 'success_indicator', 'Success Indicator already exists');
			}
			const action = result.data as FormResult<IPCRFunctionIndicatorFormResult>;
			if (form.valid && action.ipcrFunctionIndicator) {
				const ipcrFunctionIndicator = action.ipcrFunctionIndicator;
				addIpcrIndicator(ipcrFunctionIndicator);
				showSuccessToast(`Successfully added ipcr function indicator `);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: {
						ipcr_function_id: ipcrFunctionId,
						ipcr_function_category_id: ipcrFunctionCategoryId,
						ipcr_function_sub_category_id: ipcrFunctionSubCategoryId,
						position: $size + 1
					},
					newState: {
						ipcr_function_id: ipcrFunctionId,
						ipcr_function_category_id: ipcrFunctionCategoryId,
						ipcr_function_sub_category_id: ipcrFunctionSubCategoryId,
						position: $size + 1
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	if (ipcrFunctionId) {
		$formData.ipcr_function_id = ipcrFunctionId;
		//set to null the others
		$formData.ipcr_function_category_id = null;
		$formData.ipcr_function_sub_category_id = null;
	}
	if (ipcrFunctionCategoryId) {
		$formData.ipcr_function_category_id = ipcrFunctionCategoryId;
		//set to null the others
		$formData.ipcr_function_sub_category_id = null;
		$formData.ipcr_function_id = null;
	}
	if (ipcrFunctionSubCategoryId) {
		$formData.ipcr_function_sub_category_id = ipcrFunctionSubCategoryId;
		//set to null the others
		$formData.ipcr_function_category_id = null;
		$formData.ipcr_function_id = null;
	}
	$formData.position = $size + 1;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding ipcr function indicator: ${$message.text}`);
		}
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none" id="nav-2">
		<span class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			<span class=" md:inline">Add IPCR Indicator</span>
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Add IPCR Indicator</Dialog.Title>
			<Dialog.Description>
				An indicator is a measurable criterion used to assess the performance and success of a
				specific task or objective, aligning efforts with organizational goals.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createipcrindicator" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input hidden name="ipcr_function_id" value={$formData.ipcr_function_id} />
			<input hidden name="ipcr_function_category_id" value={$formData.ipcr_function_category_id} />
			<div class=" grid gap-2 md:grid-cols-2">
				<Form.Field {form} name="final_output">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Add Major Final Output</Form.Label>
							<IntelligentInput
								textAreaWidth={'full'}
								placeholder="Provide major final output."
								bind:content={$formData.final_output}
								name={props.name}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="success_indicator">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Add Success Indicators</Form.Label>
							<IntelligentInput
								textAreaWidth={'full'}
								placeholder="Provide success indicator."
								bind:content={$formData.success_indicator}
								name={props.name}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<OpIndicator
				handleIpcrOpIndicator={(e: string) => {
					$formData.op_activity_indicator_id = e;
				}}
			/>
			{#if ipcrFunctionId}
				<div class="grid grid-cols-2 gap-2">
					<Form.Field {form} name="immediate_supervisor_id">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Immediate Supervisor</Form.Label>
								<AutoCompleteOnlineInput
									bind:selectedId={$formData.immediate_supervisor_id}
									name={props.name}
									placeholder={'Type Immediate Supervisor here'}
									onSearch={fetchProfileByname}
									onFetchById={fetchProfileById}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="units">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Units</Form.Label>
								<Input
									type="number"
									step="0.1"
									placeholder={'Enter Number of Units for this category...'}
									{...props}
									bind:value={$formData.units}
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			{/if}
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
