<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil, Save } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import type { IPCRFunctionIndicatorFormResult } from '../../../utils/types';
	import { Input } from '$lib/components/ui/input';
	import AutoCompleteOnlineInput from '$lib/custom_components/AutoCompleteOnlineInput.svelte';
	import { fetchProfileByname } from '../../../utils/page_loader_services';
	import { getIpcrIndicatorFormContext } from '../../../states/ipcr_indicator_form_state';
	import { getIpcrIndicatorStore } from '../../../states/ipcr_indicator_state';
	import { updateIpcrIndicatorSchema } from '../../../schema/ipcr_indicator_schema';
	import IntelligentInput from '$lib/custom_components/IntelligentInput.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { getAuthStore } from '$lib/utils/authStore';
	import OpIndicator from './OpIndicator.svelte';
	const { currentProfile } = getAuthStore();

	//props
	interface Iprops {
		ipcrFunctionIndicator: Tables<'ipcr_indicator'>;
		isDrawerOpen: boolean;
	}

	let { ipcrFunctionIndicator, isDrawerOpen = $bindable() }: Iprops = $props();

	//stores
	const { updateForm } = getIpcrIndicatorFormContext();
	const { currentIpcrIndicators, updateIpcrIndicator } = getIpcrIndicatorStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateIpcrIndicatorSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentIpcrIndicators.some((ind) => {
					return ind.final_output === form.data.final_output && ind.id !== form.data.id;
				})
			) {
				setError(form, 'final_output', 'Output already exists');
			}
			if (
				$currentIpcrIndicators.some((ind) => {
					return ind.success_indicator === form.data.success_indicator && ind.id !== form.data.id;
				})
			) {
				setError(form, 'success_indicator', 'Success Indicator already exists');
			}
			const action = result.data as FormResult<IPCRFunctionIndicatorFormResult>;
			if (form.valid && action.ipcrFunctionIndicator) {
				const ipcrFunctionIndicator = action.ipcrFunctionIndicator;
				updateIpcrIndicator(ipcrFunctionIndicator.id, ipcrFunctionIndicator);
				showSuccessToast(`Succesfully updated ipcr function indicator `);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: {
						...ipcrFunctionIndicator
					},
					newState: {
						...ipcrFunctionIndicator
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	$formData.id = ipcrFunctionIndicator.id;
	$formData.final_output = ipcrFunctionIndicator.final_output;
	$formData.success_indicator = ipcrFunctionIndicator.success_indicator;
	$formData.op_activity_indicator_id = ipcrFunctionIndicator.op_activity_indicator_id;
	$formData.immediate_supervisor_id = ipcrFunctionIndicator.immediate_supervisor_id;
	$formData.units = ipcrFunctionIndicator.units;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding ipcr function indicator: ${$message.text}`);
		}
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} />Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Add IPCR Function Indicator</Dialog.Title>
			<Dialog.Description>
				An indicator is a measurable criterion used to assess the performance and success of a
				specific task or objective, aligning efforts with organizational goals.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateipcrindicator" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
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
				ipcrOpIndicatorId={$formData.op_activity_indicator_id}
				handleIpcrOpIndicator={(e: string) => {
					$formData.op_activity_indicator_id = e;
				}}
			/>
			{#if ipcrFunctionIndicator.ipcr_function_id}
				<div class="grid grid-cols-2 gap-2">
					{#if $currentProfile!.nature_of_work_id === 1}
						<Form.Field {form} name="immediate_supervisor_id">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Immediate Supervisor</Form.Label>
									<AutoCompleteOnlineInput
										bind:selectedId={$formData.immediate_supervisor_id}
										name={props.name}
										placeholder={'Type Immediate Supervisor here'}
										onSearch={fetchProfileByname}
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
					{:else}
						<Form.Field {form} name="units" class="col-span-2">
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
					{/if}
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
