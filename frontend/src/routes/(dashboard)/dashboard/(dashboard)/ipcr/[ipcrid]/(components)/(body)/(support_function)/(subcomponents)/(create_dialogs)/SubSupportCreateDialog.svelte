<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Plus } from 'lucide-svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { SubSupportFunctionFormResult } from '../../../../(data)/types';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import * as Form from '$lib/components/ui/form/index.js';
	import { getSubSupportFunctionFormContext } from '../../../../(data)/(forms)/sub_support_function_form.svelte';
	import { createSubSupportFunctionSchema } from '../../../../../utils/schemas/sub_support_function_schema';
	import { getSubSupportFunctionStore } from '../../../../(data)/(state)/sub_support_function_state.svelte';
	interface Props {
		subSupportId: string;
		isDrawerOpen?: boolean;
	}
	let { subSupportId, isDrawerOpen = $bindable() }: Props = $props();
	let isOpen = $state(false);

	// Get the complete store object
	const { createSubSupportFunctionForm } = getSubSupportFunctionFormContext();
	const subSupportFunctionStore = getSubSupportFunctionStore();
	// Destructure specific properties
	const { size, addSubSupportFunction } = subSupportFunctionStore;
	const form = superForm(createSubSupportFunctionForm, {
		id: subSupportId,
		dataType: 'json',
		validators: zodClient(createSubSupportFunctionSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<SubSupportFunctionFormResult>;
			if (form.valid && action.sub_support_function && subSupportFunctionStore) {
				const subSupportFunction = action.sub_support_function;
				addSubSupportFunction(subSupportFunction);
				showSuccessToast(`Successfully added sub support function ${subSupportFunction.name}`);
				const support_function_id = $formData.support_function_id; // Save ID before reset
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: { support_function_id: support_function_id, position: $size },
					newState: { support_function_id: support_function_id, position: $size }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast($message.text);
		}
		if (subSupportId) {
			$formData.support_function_id = subSupportId;
			$formData.position = $size;
		}
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Plus size={16} /> Add Sub Support Function
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Create Sub Support Function</Dialog.Title>
			<Dialog.Description>
				A sub-support function is a specific task or duty within a support function, aiding in the
				execution of supplementary responsibilities. It further breaks down support functions into
				actionable components for detailed performance evaluation.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createsubsupportfunction" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input hidden name="support_function_id" value={$formData.support_function_id} />
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Title</Form.Label>
						<Input {...props} bind:value={$formData.name} />
						<Form.Description>This is the title of the sub support function.</Form.Description>
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
