<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { showSuccessToast, showWarningToast } from '$lib/utils/toast';
	import { superForm, type FormResult, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { LoaderCircle } from 'lucide-svelte';
	import { TriangleAlert } from 'lucide-svelte';
	import { Trash2 } from 'lucide-svelte';
	import { getCoreFunctionStore } from '../../../../(data)/(state)/corefunctionstate.svelte';
	import type { CoreFunctionFormResult } from '../../../../(data)/types';
	import { getCoreFunctionFormContext } from '../../../../(data)/(forms)/core_function_form.svelte';
	import { universalDeleteSchema } from '../../../../../utils/schemas/universal_delete_schema';
	interface Props {
		id: string;
		isDrawerOpen: boolean;
	}
	const { currentCoreFunctions, removeCoreFunction } = getCoreFunctionStore();

	let { id, isDrawerOpen = $bindable() }: Props = $props();
	const { deleteCoreFunctionForm: data } = getCoreFunctionFormContext();
	const form = superForm(data, {
		validators: zodClient(universalDeleteSchema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<CoreFunctionFormResult>;
			if (form.valid && action.core_function) {
				const coreFunction = action.core_function;
				removeCoreFunction(coreFunction.id);
				showWarningToast(`Succesfully deleted IPCR ${coreFunction.name}`);
				isDrawerOpen = false;
			}
		}
	});
	const { form: formData, enhance, message, delayed } = form;
	$effect(() => {
		if ($message?.status === 'error') {
			showSuccessToast($message.text);
		}
	});
	let isOpen = $state(false);
	const currentCoreFunction = $currentCoreFunctions.find((c) => c.id === id);
	let name = $state('');
	if (currentCoreFunction) {
		$formData.id = currentCoreFunction.id;
		$formData.expectedText = currentCoreFunction.name;
		name = currentCoreFunction.name;
	}
</script>

<AlertDialog.Root bind:open={isOpen}>
	<AlertDialog.Trigger class=" focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Trash2 size={16} />Delete
		</span>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title
				><span class="flex items-center gap-4"
					><TriangleAlert class="text-red-600" /> Are you absolutely sure?</span
				></AlertDialog.Title
			>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete {name} and all its dependants.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/deletecorefunction" use:enhance>
			<Input name="expectedText" class="hidden" bind:value={$formData.expectedText} />
			<Input name="id" class="hidden" bind:value={$formData.id} />
			<Form.Field {form} name="confirmText">
				<Form.FieldErrors />
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Please Confirm</Form.Label>
						<Input {...props} bind:value={$formData.confirmText} />
					{/snippet}
				</Form.Control>
				<Form.Description
					>Please type <span class=" font-bold">{name}</span> to proceed.
				</Form.Description>
			</Form.Field>
			{#if $delayed}
				<div class="flex justify-between">
					<AlertDialog.Cancel disabled class="text-gray-500" type="button"
						>Cancel</AlertDialog.Cancel
					>
					<Form.Button disabled class="bg-red-300 text-white">
						<LoaderCircle class="animate-spin" />Deleting...
					</Form.Button>
				</div>
			{:else}
				<div class="flex justify-between">
					<AlertDialog.Cancel type="button" class="text-gray-600 hover:text-gray-800">
						Cancel
					</AlertDialog.Cancel>
					<AlertDialog.Action
						type="submit"
						class="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
					>
						<Trash2 />Delete
					</AlertDialog.Action>
				</div>
			{/if}
		</form>
		<AlertDialog.Footer></AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
