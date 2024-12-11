<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Pencil } from 'lucide-svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import { getSubCoreFunctionFormContext } from '../../../../(data)/(forms)/sub_core_function_form.svelte';
	import { getSubCoreFunctionStore } from '../../../../(data)/(state)/subcorefunctionstate.svelte';
	import { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { updateSubCoreFunctionSchema } from '../../../../../utils/schemas/sub_core_function_schema';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import * as Form from '$lib/components/ui/form/index.js';
	import type { SubCoreFunctionFormResult } from '../../../../(data)/types';
	interface Props {
		subCoreFunctionId: string;
		isDrawerOpen: boolean;
	}
	let { subCoreFunctionId, isDrawerOpen = $bindable() }: Props = $props();
	let isOpen = $state(false);
	const { updateSubCoreFunctionForm: data } = getSubCoreFunctionFormContext();
	// Get the complete store object
	const subCoreFunctionStore = getSubCoreFunctionStore();

	// Destructure specific properties
	const { currentSubCoreFunctions } = subCoreFunctionStore;

	const form = superForm(data!, {
		dataType: 'json',
		validators: zodClient(updateSubCoreFunctionSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<SubCoreFunctionFormResult>;
			if (form.valid && action.subCoreFunction && subCoreFunctionStore) {
				const subCoreFunction = action.subCoreFunction;
				subCoreFunctionStore.updateSubCoreFunction(subCoreFunction.id, subCoreFunction);
				showSuccessToast(`Succesfully added core function ${subCoreFunction.name}`);
				const sub_core_function_id = $formData.id; // Save ID before reset
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: { id: sub_core_function_id },
					newState: { id: sub_core_function_id }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast($message.text);
		}
		if (subCoreFunctionId) {
			$formData.id = subCoreFunctionId;
		}
		const currentSubCoreFunction = $currentSubCoreFunctions.find(
			(sf) => sf.id === subCoreFunctionId
		);
		if (currentSubCoreFunction) {
			$formData.name = currentSubCoreFunction.name;
		}
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} />Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Create Sub Core Function</Dialog.Title>
			<Dialog.Description>
				A sub-core function is a specific task or duty within a core function, supporting the
				achievement of the primary responsibilities. It further breaks down core functions into
				actionable components for detailed performance evaluation.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updatesubcorefunction" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Title</Form.Label>
						<Input {...props} bind:value={$formData.name} />
						<Form.Description>This is the title of the sub core function.</Form.Description>
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
