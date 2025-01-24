<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import AutoCompleteOfflineInput from '$lib/custom_components/AutoCompleteOfflineInput.svelte';
	import { getCurrentDpcrStore } from '../../../states/dpcr_state';
	import { getDpcrFunctionFormContext } from '../../../states/function_form_state';
	import { getDpcrFunctionStore } from '../../../states/function_state';
	import { createDpcrFunctionSchema } from '../../../schema/function_schema';
	import type { DPCRFunctionFormResult } from '../../../utils/types';

	//stores
	const { currentDpcr } = getCurrentDpcrStore();
	const { createForm } = getDpcrFunctionFormContext();
	const { currentDpcrFunctions, addDpcrFunction, size } = getDpcrFunctionStore();
	//states
	let isOpen = $state(false);

	//form
	const form = superForm(createForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(createDpcrFunctionSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if ($currentDpcrFunctions.some((func) => func.title === form.data.title)) {
				setError(form, 'title', 'Title already exists');
			}
			const action = result.data as FormResult<DPCRFunctionFormResult>;
			console.log(action);
			if (form.valid && action.dpcrFunction) {
				const dpcrFunction = action.dpcrFunction;
				addDpcrFunction(dpcrFunction);
				showSuccessToast(`Succesfully added dpcr function ${dpcrFunction.title}`);
				isOpen = false;
				reset({
					data: { dpcr_id: dpcrFunction.dpcr_id, position: $size + 1 },
					newState: { dpcr_id: dpcrFunction.dpcr_id, position: $size + 1 }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	if ($currentDpcr) {
		$formData.dpcr_id = $currentDpcr.id;
		$formData.position = $size + 1;
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
			<Dialog.Title>Add DPCR Function</Dialog.Title>
			<Dialog.Description>
				DPCR functions are key responsibilities that guide performance targets and evaluations.<br
				/>
				<span> *You can still add unspecified values beyond the given ones as you type.* </span>
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createdpcrfunction" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input hidden name="dpcr_id" value={$formData.dpcr_id} />
			<Form.Field {form} name="title">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Title</Form.Label>
						<AutoCompleteOfflineInput
							{items}
							bind:text={$formData.title}
							name={props.name}
							placeholder={'Core function, Support ...'}
						/>
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
