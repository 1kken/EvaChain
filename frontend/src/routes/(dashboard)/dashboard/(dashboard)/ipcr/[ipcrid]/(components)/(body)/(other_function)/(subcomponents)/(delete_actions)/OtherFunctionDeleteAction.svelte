<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { showWarningToast } from '$lib/utils/toast';
	import { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { LoaderCircle } from 'lucide-svelte';
	import { TriangleAlert } from 'lucide-svelte';
	import { Trash2 } from 'lucide-svelte';
	import type { OtherFunctionFormResult } from '../../../../(data)/types';
	import { universalDeleteSchema } from '../../../../../utils/schemas/universal_delete_schema';
	import { getOtherFunctionFormContext } from '../../../../(data)/(forms)/other_function_form.svelte';
	import { getOtherFunctionStore } from '../../../../(data)/(state)/other_function_state.svelte';

	interface Props {
		otherFunctionId: string;
		isDrawerOpen: boolean;
	}

	const { currentOtherFunctions, removeOtherFunction } = getOtherFunctionStore();
	const { deleteOtherFunctionForm } = getOtherFunctionFormContext();

	let { otherFunctionId, isDrawerOpen = $bindable() }: Props = $props();

	const form = superForm(deleteOtherFunctionForm, {
		validators: zodClient(universalDeleteSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<OtherFunctionFormResult>;
			if (form.valid && action) {
				const other_function = action.other_function;
				removeOtherFunction(other_function.id);
				showWarningToast(`Successfully deleted support ${other_function.name} function`);
				isDrawerOpen = false;
			}
		}
	});

	const { form: formData, enhance, delayed } = form;

	let isOpen = $state(false);
	const currentOtherFunction = $currentOtherFunctions.find((c) => c.id === otherFunctionId);
	let name = $state('');

	if (currentOtherFunction) {
		$formData.id = currentOtherFunction.id;
		$formData.expectedText = currentOtherFunction.name;
		name = currentOtherFunction.name;
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
			<AlertDialog.Title>
				<span class="flex items-center gap-4">
					<TriangleAlert class="text-red-600" /> Are you absolutely sure?
				</span>
			</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete {name} and all its dependants.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/deleteotherfunction" use:enhance>
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
				<Form.Description>
					Please type <span class="font-bold">{name}</span> to proceed.
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
