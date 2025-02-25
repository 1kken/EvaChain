<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { showErrorToast, showSuccessToast, showWarningToast } from '$lib/utils/toast';
	import { superForm, type FormResult, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { CircleFadingArrowUp, LoaderCircle, Star } from 'lucide-svelte';
	import { TriangleAlert } from 'lucide-svelte';
	import type { Tables } from '$lib/types/database.types';
	import { uuidSchema, type UuidSchemaInput } from '../../(data)/zod_schema';
	interface Props {
		ipcr_details: Tables<'ipcr_supervisor_details_view'>;
		uuidForm: SuperValidated<UuidSchemaInput>;
		dropDownOpen: boolean;
	}

	let { ipcr_details, dropDownOpen = $bindable(), uuidForm }: Props = $props();
	const form = superForm(uuidForm, {
		validators: zodClient(uuidSchema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		invalidateAll: true,
		onUpdate({ form, result }) {
			if (form.valid && result.type === 'success')
				if (form.valid) {
					showSuccessToast(
						`Successfully set the status of "${ipcr_details.ipcr_title}" to "Under Review."`
					);
					closeAllTabs();
				}
		}
	});

	const { form: formData, enhance, message, delayed } = form;

	function closeAllTabs() {
		isOpen = false;
		dropDownOpen = false;
	}

	$effect(() => {
		if ($message?.status == 'error') {
			showErrorToast($message.text);
			closeAllTabs();
		}

		if ($message?.status == 'warning') {
			showWarningToast($message.text);
			closeAllTabs();
		}
	});

	$formData.id = ipcr_details.supervisor_relationship_id!;
	let isOpen = $state(false);
</script>

<AlertDialog.Root bind:open={isOpen}>
	<AlertDialog.Trigger class="focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Star size="16" /> Set Status as Reviewing
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
				This will set the status of the IPCR as <span class="font-bold">Reviewing.</span>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/review" use:enhance>
			<Input name="id" class="hidden" bind:value={$formData.id} />
			{#if $delayed}
				<div class="flex justify-between">
					<AlertDialog.Cancel disabled class="text-gray-500" type="button"
						>Cancel</AlertDialog.Cancel
					>
					<Form.Button disabled class="bg-red-300 text-white">
						<LoaderCircle class="animate-spin" />Updating...
					</Form.Button>
				</div>
			{:else}
				<div class="flex justify-between">
					<AlertDialog.Cancel type="button" class="text-gray-600 hover:text-gray-800">
						Cancel
					</AlertDialog.Cancel>
					<AlertDialog.Action
						type="submit"
						class="bg-green-700 text-white hover:bg-green-600 focus:ring-green-500"
					>
						<CircleFadingArrowUp /> Update
					</AlertDialog.Action>
				</div>
			{/if}
		</form>
		<AlertDialog.Footer></AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
