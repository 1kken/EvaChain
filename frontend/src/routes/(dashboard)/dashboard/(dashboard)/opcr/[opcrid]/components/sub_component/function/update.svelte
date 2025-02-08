<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil, Save } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import AutoCompleteOfflineInput from '$lib/custom_components/AutoCompleteOfflineInput.svelte';
	import type { Tables } from '$lib/types/database.types';
	import { getOpcrFunctionFormContext } from '../../../states/function_form_state';
	import { getOpcrFunctionStore } from '../../../states/function_state';
	import { updateOpcrFunctionSchema } from '../../../schema/function_schema';
	import type { OPCRFunctionFormResult } from '../../../utils/types';

	//props
	let {
		opcrFunction,
		isDrawerOpen = $bindable()
	}: { opcrFunction: Tables<'opcr_function'>; isDrawerOpen: boolean } = $props();

	//stores
	const { updateForm } = getOpcrFunctionFormContext();
	const { currentOpcrFunctions, updateOpcrFunction } = getOpcrFunctionStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateOpcrFunctionSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentOpcrFunctions.some(
					(func) =>
						func.title.toLocaleLowerCase() === form.data.title.toLocaleLowerCase() &&
						func.id !== form.data.id
				)
			) {
				setError(form, 'title', 'Title already exists');
			}
			const action = result.data as FormResult<OPCRFunctionFormResult>;
			if (form.valid && action.opcrFunction) {
				const opcrFunction = action.opcrFunction;
				updateOpcrFunction(opcrFunction.id, opcrFunction);
				showSuccessToast(`Succesfully updated OPCR function ${opcrFunction.title}`);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: { id: opcrFunction.id },
					newState: { id: opcrFunction.id }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	$effect(() => {
		$formData.id = opcrFunction.id;
		$formData.title = opcrFunction.title;
	});

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding OPCR function: ${$message.text}`);
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
			<Dialog.Title>Update OPCR Function</Dialog.Title>
			<Dialog.Description>
				OPCR functions are key responsibilities that guide performance targets and evaluations.<br
				/>
				<span> *You can still add unspecified values beyond the given ones as you type.* </span>
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updatedocrfunction" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
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
