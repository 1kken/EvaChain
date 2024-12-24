<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle } from 'lucide-svelte';
	import { Pencil } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { getOpHeaderStore } from '../../../states/op_header_state';
	import { getOpHeaderFormContext } from '../../../states/op_header_form_state';
	import { updateOpHeaderSchema } from '../../../schema/op_header_schema';
	import type { OpHeaderFormResult } from '../../../utils/type';
	import AutoCompleteOfflineInput from '$lib/custom_components/AutoCompleteOfflineInput.svelte';
	import type { Tables } from '$lib/types/database.types';

	interface Iprops {
		opHeader: Tables<'op_header'>;
		isDrawerOpen: boolean;
	}

	let { opHeader, isDrawerOpen = $bindable() }: Iprops = $props();
	//stores
	const { currentOpHeaders } = getOpHeaderStore();
	const { updateForm } = getOpHeaderFormContext();
	const { updateOpHeader } = getOpHeaderStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		dataType: 'json',
		validators: zodClient(updateOpHeaderSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentOpHeaders.some(
					(opHeader) => opHeader.title.toLowerCase() === form.data.title.toLowerCase()
				)
			) {
				setError(form, 'title', 'Title already exists');
			}
			const action = result.data as FormResult<OpHeaderFormResult>;
			if (form.valid && action.opHeader) {
				const opHeader = action.opHeader;
				updateOpHeader(opHeader.id, opHeader);
				showSuccessToast(`Succesfully added core function ${opHeader.title}`);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: { id: opHeader.id },
					newState: { id: opHeader.id }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	$formData.id = opHeader.id;
	$formData.title = opHeader.title;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding operational header: ${$message.text}`);
		}
	});

	//for auto complete input
	let items = [
		'Instruction',
		'Research',
		'Extension And Community Management',
		'Faculty Development',
		'Infrastructure And Technology',
		'Internationalization And Linkages',
		'Administration'
	];
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} />Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content
		class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]"
		onOpenAutoFocus={(e) => e.preventDefault()}
	>
		<Dialog.Header>
			<Dialog.Title>Edit Operational Header</Dialog.Title>
			<Dialog.Description>
				Operational headers are Key areas supporting institutional growth, including instruction,
				research, community management, faculty development, infrastructure, international linkages,
				and administration.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateopheader" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
			<Form.Field {form} name="title">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Title</Form.Label>
						<AutoCompleteOfflineInput
							{items}
							bind:text={$formData.title}
							name={props.name}
							placeholder={'Type Operational Header'}
						/>
						<Form.Description>This is the title of the core function.</Form.Description>
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
