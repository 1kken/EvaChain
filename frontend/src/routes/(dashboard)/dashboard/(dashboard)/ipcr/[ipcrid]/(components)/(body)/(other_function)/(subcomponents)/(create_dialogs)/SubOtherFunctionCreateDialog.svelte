<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Plus } from 'lucide-svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { SubOtherFunctionFormResult } from '../../../../(data)/types';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import * as Form from '$lib/components/ui/form/index.js';
	import { getSubOtherFunctionFormContext } from '../../../../(data)/(forms)/sub_other_function_form.svelte';
	import { createSubOtherFunctionSchema } from '../../../../../utils/schemas/sub_other_function_schema';
	import { getSubOtherFunctionStore } from '../../../../(data)/(state)/sub_other_function_state.svelte';

	interface Props {
		otherFunctionId: string;
		isDrawerOpen?: boolean;
	}
	let { otherFunctionId, isDrawerOpen = $bindable() }: Props = $props();
	let isOpen = $state(false);

	// Get the complete store object
	const { createSubOtherFunctionForm } = getSubOtherFunctionFormContext();
	const subOtherFunctionStore = getSubOtherFunctionStore();
	// Destructure specific properties
	const { size, addSubOtherFunction } = subOtherFunctionStore;
	const form = superForm(createSubOtherFunctionForm, {
		id: otherFunctionId,
		dataType: 'json',
		validators: zodClient(createSubOtherFunctionSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<SubOtherFunctionFormResult>;
			if (form.valid && action.sub_other_function && subOtherFunctionStore) {
				const subOtherFunction = action.sub_other_function;
				addSubOtherFunction(subOtherFunction);
				showSuccessToast(`Successfully added other function ${subOtherFunction.name}`);
				const other_function_id = $formData.other_function_id; // Save ID before reset
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: { other_function_id: other_function_id, position: $size },
					newState: { other_function_id: other_function_id, position: $size }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast($message.text);
		}
		if (otherFunctionId) {
			$formData.other_function_id = otherFunctionId;
			$formData.position = $size;
		}
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Plus size={16} /> Add Sub Other Function
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Create Sub Other Function</Dialog.Title>
			<Dialog.Description>
				A sub-other function is a specific task or duty within an other function, breaking down the
				additional responsibilities into more detailed components for comprehensive performance
				evaluation.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createsubotherfunction" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input hidden name="other_function_id" value={$formData.other_function_id} />
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Title</Form.Label>
						<Input {...props} bind:value={$formData.name} />
						<Form.Description>This is the title of the sub other function.</Form.Description>
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
