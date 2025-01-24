<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import AutoCompleteOfflineInput from '$lib/custom_components/AutoCompleteOfflineInput.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { Input } from '$lib/components/ui/input';
	import { getDpcrFunctionStore } from '../../../states/function_state';
	import { getDpcrFunctionFormContext } from '../../../states/function_form_state';
	import { updateDpcrFunctionSchema } from '../../../schema/function_schema';
	import type { DPCRFunctionFormResult } from '../../../utils/types';

	//props
	let {
		dpcrFunction,
		isDrawerOpen = $bindable()
	}: { dpcrFunction: Tables<'dpcr_function'>; isDrawerOpen: boolean } = $props();

	//stores
	const { updateForm } = getDpcrFunctionFormContext();
	const { currentDpcrFunctions, updateDpcrFunction } = getDpcrFunctionStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateDpcrFunctionSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentDpcrFunctions.some(
					(func) => func.title === form.data.title && func.id !== form.data.id
				)
			) {
				setError(form, 'title', 'Title already exists');
			}
			const action = result.data as FormResult<DPCRFunctionFormResult>;
			if (form.valid && action.dpcrFunction) {
				const dpcrFunction = action.dpcrFunction;
				updateDpcrFunction(dpcrFunction.id, dpcrFunction);
				showSuccessToast(`Succesfully added dpcr function ${dpcrFunction.title}`);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: { id: dpcrFunction.id },
					newState: { id: dpcrFunction.id }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	$effect(() => {
		$formData.id = dpcrFunction.id;
		$formData.title = dpcrFunction.title;
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
		<form action="?/updatedpcrfunction" method="POST" use:enhance class="space-y-6">
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
