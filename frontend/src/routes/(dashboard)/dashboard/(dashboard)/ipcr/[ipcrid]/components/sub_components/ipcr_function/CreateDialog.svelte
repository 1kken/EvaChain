<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Save } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import AutoCompleteOfflineInput from '$lib/custom_components/AutoCompleteOfflineInput.svelte';
	import { getIpcrFunctionFormContext } from '../../../states/ipcr_function_form_state';
	import { createIpcrFunctionSchema } from '../../../schema/ipcr_function_schema';
	import { getIpcrFunctionStore } from '../../../states/ipcr_function_state';
	import type { IPCRFunctionFormResult } from '../../../utils/types';
	import { getIpcrStore } from '../../../states/current_ipcr_state';
	import Input from '$lib/components/ui/input/input.svelte';

	//stores
	const { currentIpcr } = getIpcrStore();
	const { createForm } = getIpcrFunctionFormContext();
	const { currentIpcrFunctions, addIpcrFunction, size, getTotalPercentage } =
		getIpcrFunctionStore();
	//states
	let isOpen = $state(false);
	let totalPercentage = $state(getTotalPercentage());
	//form
	const form = superForm(createForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(createIpcrFunctionSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentIpcrFunctions.some(
					(ipcrFunction) => ipcrFunction.title.toLowerCase() === form.data.title.toLowerCase()
				)
			) {
				setError(form, 'title', 'Title already exists');
			}
			const action = result.data as FormResult<IPCRFunctionFormResult>;
			if (form.valid && action.ipcrFunction) {
				const ipcrFunction = action.ipcrFunction;
				addIpcrFunction(ipcrFunction);
				showSuccessToast(`Succesfully added ipcr function ${ipcrFunction.title}`);
				isOpen = false;
				reset({
					data: { ipcr_id: ipcrFunction.ipcr_id, position: $size + 1 },
					newState: { ipcr_id: ipcrFunction.ipcr_id, position: $size + 1 }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	if ($currentIpcr) {
		$formData.ipcr_id = $currentIpcr.id;
		$formData.position = $size + 1;
		$formData.remainingPercentage = 100 - totalPercentage;
	}

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding ipcr function: ${$message.text}`);
		}
	});

	//for auto complete input
	let items = ['Core Functions', 'Strategic Functions', 'Support Functions', 'Faculty Development'];
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none" id="nav-2">
		<span class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			<span class="hidden md:inline">Add Function</span>
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Add IPCR Function</Dialog.Title>
			<Dialog.Description>
				IPCR functions are key responsibilities that guide performance targets and evaluations.<br
				/>
				<span> *You can still add unspecified values beyond the given ones as you type.* </span>
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createipcrfunction" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input hidden name="ipcr_id" value={$formData.ipcr_id} />
			<Form.Field {form} name="title">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Title</Form.Label>
						<AutoCompleteOfflineInput
							{items}
							bind:text={$formData.title}
							name={props.name}
							placeholder={'Type IPCR Function here'}
						/>
						<Form.Field {form} name="percentage">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Weight Percentage Allocation</Form.Label>
									<Input type="number" {...props} bind:value={$formData.percentage} />
								{/snippet}
							</Form.Control>
							<Form.Description
								>This will be used for calculating your IPCR report, Remaining percentage <span
									class="font-bold">{totalPercentage}% / 100%</span
								>.</Form.Description
							>
							<Form.FieldErrors />
						</Form.Field>
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
