<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Pencil } from 'lucide-svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import { getSubSupportFunctionFormContext } from '../../../../(data)/(forms)/sub_support_function_form.svelte';
	import { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { updateSubSupportFunctionSchema } from '../../../../../utils/schemas/sub_support_function_schema';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import * as Form from '$lib/components/ui/form/index.js';
	import type { SubSupportFunctionFormResult } from '../../../../(data)/types';
	import { getSubSupportFunctionStore } from '../../../../(data)/(state)/sub_support_function_state.svelte';

	interface Props {
		subSupportFunctionId: string;
		isDrawerOpen: boolean;
	}

	let { subSupportFunctionId, isDrawerOpen = $bindable() }: Props = $props();
	let isOpen = $state(false);

	const { updateSubSupportFunctionForm: data } = getSubSupportFunctionFormContext();
	const subSupportFunctionStore = getSubSupportFunctionStore();
	const { currentSubSupportFunctions } = subSupportFunctionStore;

	const form = superForm(data!, {
		dataType: 'json',
		validators: zodClient(updateSubSupportFunctionSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<SubSupportFunctionFormResult>;
			if (form.valid && action.sub_support_function && subSupportFunctionStore) {
				const subSupportFunction = action.sub_support_function;
				subSupportFunctionStore.updateSubSupportFunction(subSupportFunction.id, subSupportFunction);
				showSuccessToast(`Successfully updated support function ${subSupportFunction.name}`);
				const sub_support_function_id = $formData.id;
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: { id: sub_support_function_id },
					newState: { id: sub_support_function_id }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;

	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast($message.text);
		}
		if (subSupportFunctionId) {
			$formData.id = subSupportFunctionId;
		}
		const currentSubSupportFunction = $currentSubSupportFunctions.find(
			(sf) => sf.id === subSupportFunctionId
		);
		if (currentSubSupportFunction) {
			$formData.name = currentSubSupportFunction.name;
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
			<Dialog.Title>Update Sub Support Function</Dialog.Title>
			<Dialog.Description>
				A sub-support function is a specific task or duty within a support function, assisting in
				the achievement of secondary responsibilities. It further breaks down support functions into
				actionable components for detailed performance evaluation.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updatesubsupportfunction" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
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
