<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { showWarningToast } from '$lib/utils/toast';
	import { superForm, type FormResult, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { LoaderCircle } from 'lucide-svelte';
	import { TriangleAlert } from 'lucide-svelte';
	import { Trash2 } from 'lucide-svelte';
	import { getSubCoreFunctionStore } from '../../../../(data)/(state)/subcorefunctionstate.svelte';
	import { getSubCoreFunctionFormContext } from '../../../../(data)/(forms)/sub_core_function_form.svelte';
	import type { SubCoreFunctionFormResult } from '../../../../(data)/types';
	import { universalDeleteSchema } from '../../../../../utils/schemas/universal_delete_schema';

	interface Props {
		subCoreFunctionId: string;
		isDrawerOpen: boolean;
	}
	const { currentSubCoreFunctions, removeSubCoreFunction } = getSubCoreFunctionStore();
	const { deleteSubCoreFunctionForm: data } = getSubCoreFunctionFormContext();
	let { subCoreFunctionId, isDrawerOpen = $bindable() }: Props = $props();
	const form = superForm(data, {
		validators: zodClient(universalDeleteSchema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<SubCoreFunctionFormResult>;
			if (form.valid && action) {
				const sub_core_function = action.subCoreFunction;
				removeSubCoreFunction(sub_core_function.id);
				showWarningToast(`Succesfully deleted IPCR ${sub_core_function.name}`);
				isDrawerOpen = false;
			}
		}
	});
	const { form: formData, enhance, delayed } = form;
	let isOpen = $state(false);
	const currentSubCoreFunction = $currentSubCoreFunctions.find((c) => c.id === subCoreFunctionId);
	let name = $state('');
	if (currentSubCoreFunction) {
		$formData.id = currentSubCoreFunction.id;
		$formData.expectedText = currentSubCoreFunction.name;
		name = currentSubCoreFunction.name;
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
		<form method="POST" action="?/deletesubcorefunction" use:enhance>
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
