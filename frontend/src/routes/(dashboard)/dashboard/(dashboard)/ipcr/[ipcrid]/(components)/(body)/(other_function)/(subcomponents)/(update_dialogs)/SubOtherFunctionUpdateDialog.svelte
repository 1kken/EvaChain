<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Pencil } from 'lucide-svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import { getSubOtherFunctionFormContext } from '../../../../(data)/(forms)/sub_other_function_form.svelte';
	import { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { updateSubOtherFunctionSchema } from '../../../../../utils/schemas/sub_other_function_schema';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import * as Form from '$lib/components/ui/form/index.js';
	import type { SubOtherFunctionFormResult } from '../../../../(data)/types';
	import { getSubOtherFunctionStore } from '../../../../(data)/(state)/sub_other_function_state.svelte';

	interface Props {
		subOtherFunctionId: string;
		isDrawerOpen: boolean;
	}

	let { subOtherFunctionId, isDrawerOpen = $bindable() }: Props = $props();
	let isOpen = $state(false);

	const { updateSubOtherFunctionForm: data } = getSubOtherFunctionFormContext();
	const subOtherFunctionStore = getSubOtherFunctionStore();
	const { currentSubOtherFunctions } = subOtherFunctionStore;

	const form = superForm(data!, {
		dataType: 'json',
		validators: zodClient(updateSubOtherFunctionSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<SubOtherFunctionFormResult>;
			if (form.valid && action.sub_other_function && subOtherFunctionStore) {
				const subOtherFunction = action.sub_other_function;
				subOtherFunctionStore.updateSubOtherFunction(subOtherFunction.id, subOtherFunction);
				showSuccessToast(`Successfully updated other function ${subOtherFunction.name}`);
				const sub_other_function_id = $formData.id;
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: { id: sub_other_function_id },
					newState: { id: sub_other_function_id }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;

	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast($message.text);
		}
		if (subOtherFunctionId) {
			$formData.id = subOtherFunctionId;
		}
		const currentSubOtherFunction = $currentSubOtherFunctions.find(
			(of) => of.id === subOtherFunctionId
		);
		if (currentSubOtherFunction) {
			$formData.name = currentSubOtherFunction.name;
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
			<Dialog.Title>Update Sub Other Function</Dialog.Title>
			<Dialog.Description>
				A sub-other function is a specific task or duty within an other function, breaking down
				additional responsibilities into actionable components for detailed performance evaluation.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updatesubotherfunction" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
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
