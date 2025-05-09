<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { LoaderCircle, TriangleAlert, Trash2 } from 'lucide-svelte';
	import { showSuccessToast } from '$lib/utils/toast';
	import {
		universalDeleteSchema,
		type UniversalDeleteInput
	} from '$lib/schemas/universal_delete_schema';

	interface Props {
		id: string;
		name?: string;
		action: string;
		data: SuperValidated<UniversalDeleteInput>;
		onDelete: (result: { type: string; data: any }) => void;
		isDrawerOpen?: boolean;
	}

	let { id, name = 'delete', action, data, onDelete, isDrawerOpen = $bindable() }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(universalDeleteSchema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		onUpdate({ form, result }) {
			if (form.valid) {
				onDelete(result);
				if (isDrawerOpen !== undefined) {
					closeAll();
				}
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
	function closeAll() {
		isOpen = false;
		isDrawerOpen = false;
	}

	// Set form data
	$effect(() => {
		$formData.id = id;
		$formData.expectedText = name;
	});
</script>

<AlertDialog.Root bind:open={isOpen}>
	<AlertDialog.Trigger class="focus-visible:outline-none">
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

		<form method="POST" {action} use:enhance>
			<Input name="expectedText" class="hidden" bind:value={$formData.expectedText} />
			<Input name="id" class="hidden" bind:value={$formData.id} />

			<Form.Field {form} name="confirmText">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Please Confirm</Form.Label>
						<Input {...props} bind:value={$formData.confirmText} />
					{/snippet}
				</Form.Control>
				<Form.Description>
					Please type <span class="font-bold">{name}</span> to proceed.
				</Form.Description>
				<Form.FieldErrors />
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
	</AlertDialog.Content>
</AlertDialog.Root>
