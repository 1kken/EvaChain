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
	import type { Tables } from '$lib/types/database.types';
	import { getIndicatorFormContext } from '../(data)/indicator_form.svelte';
	import { getIndicatorStore } from '../(data)/indicator_state.svelte';
	import type { indicatorFormResult } from '../(data)/types';
	import { universalDeleteSchema } from '../(data)/universal_delete_schema';
	import { handleIndicatorConfig } from './utils';

	interface Props {
		indicator: Tables<'indicator'>;
		isDrawerOpen: boolean;
	}

	let isOpen = $state(false);

	let { indicator, isDrawerOpen = $bindable() }: Props = $props();

	//stores
	const { deleteIndicatorForm } = getIndicatorFormContext();
	const indicatorStore = getIndicatorStore();
	const form = superForm(deleteIndicatorForm, {
		validators: zodClient(universalDeleteSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<indicatorFormResult>;
			if (form.valid && action.indicatorData && indicatorStore) {
				const indicator = action.indicatorData;
				indicatorStore.removeIndicator(indicator.id);
				showWarningToast(`Succesfully deleted indicator!`);
				isOpen = false;
				isDrawerOpen = false;
			}
		}
	});

	const { form: formData, enhance, delayed, reset } = form;
	$formData.expectedText = 'delete';
	$formData.id = indicator.id;
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
		<form method="POST" action="?/deleteindicator" use:enhance>
			<Input name="id" class="hidden" bind:value={$formData.id} />
			<Input name="expectedText" class="hidden" bind:value={$formData.expectedText} />
			<Form.Field {form} name="confirmText">
				<Form.FieldErrors />
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Please Confirm</Form.Label>
						<Input {...props} bind:value={$formData.confirmText} />
					{/snippet}
				</Form.Control>
				<Form.Description
					>Please type <span class=" font-bold">delete</span> to proceed.
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
