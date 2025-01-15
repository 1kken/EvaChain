<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import AutoCompleteOfflineInput from '$lib/custom_components/AutoCompleteOfflineInput.svelte';
	import { getIpcrFunctionFormContext } from '../../../states/ipcr_function_form_state';
	import {
		createIpcrFunctionSchema,
		updateIpcrFunctionSchema
	} from '../../../schema/ipcr_function_schema';
	import { getIpcrFunctionStore } from '../../../states/ipcr_function_state';
	import type { IPCRFunctionFormResult } from '../../../utils/types';
	import type { Tables } from '$lib/types/database.types';
	import { Input } from '$lib/components/ui/input';

	//props
	let {
		ipcrFunction,
		isDrawerOpen = $bindable()
	}: { ipcrFunction: Tables<'ipcr_function'>; isDrawerOpen: boolean } = $props();

	//stores
	const { updateForm } = getIpcrFunctionFormContext();
	const { currentIpcrFunctions, updateIpcrFunction, getTotalPercentage } = getIpcrFunctionStore();
	let totalPercentage = $state(getTotalPercentage());
	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateIpcrFunctionSchema),
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
				updateIpcrFunction(ipcrFunction.id, ipcrFunction);
				showSuccessToast(`Succesfully added ipcr function ${ipcrFunction.title}`);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: { id: ipcrFunction.id },
					newState: { id: ipcrFunction.id }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	$effect(() => {
		$formData.id = ipcrFunction.id;
		$formData.title = ipcrFunction.title;
		$formData.percentage = ipcrFunction.percentage;
		$formData.remainingPercentage = 100 - totalPercentage;
	});

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
	<Dialog.Trigger class="focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} />Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content
		class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]"
		onOpenAutoFocus={(e) => e.preventDefault()}
	>
		<Dialog.Header>
			<Dialog.Title>Update IPCR Function</Dialog.Title>
			<Dialog.Description>
				IPCR functions are key responsibilities that guide performance targets and evaluations.<br
				/>
				<span> *You can still add unspecified values beyond the given ones as you type.* </span>
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateipcrfunction" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
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
					<Form.Button disabled><LoaderCircle class="animate-spin" />Processing...</Form.Button>
				{:else}
					<Form.Button>Submit</Form.Button>
				{/if}
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
