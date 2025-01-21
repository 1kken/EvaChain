<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import AutoCompleteOfflineInput from '$lib/custom_components/AutoCompleteOfflineInput.svelte';
	import { getCurrentAccomplishmentReportStore } from '../../../states/current_accomplishment_report_state';
	import { getAccomplishmentHeaderStore } from '../../../states/header_state';
	import { getAccomplishmentHeaderFormContext } from '../../../states/header_form_state';
	import {
		createAccomplishmentHeaderSchema,
		updateAccomplishmentHeaderSchema
	} from '../../../schema/header_schema';
	import type { HeaderFormResult } from '../../../utils/type';
	import type { Tables } from '$lib/types/database.types';

	//stores
	const { updateAccomplishmentHeader, currentAccomplishmentHeaders } =
		getAccomplishmentHeaderStore();
	const { updateForm } = getAccomplishmentHeaderFormContext();

	//props
	interface Iprops {
		accHeader: Tables<'accomplishment_header'>;
		isDrawerOpen: boolean;
	}
	let { accHeader, isDrawerOpen = $bindable() }: Iprops = $props();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateAccomplishmentHeaderSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentAccomplishmentHeaders.find(
					(accHeader) =>
						accHeader.title.toLowerCase() === form.data.title.toLowerCase() &&
						accHeader.id !== form.data.id
				)
			) {
				setError(form, 'title', 'Title already exists');
			}
			const action = result.data as FormResult<HeaderFormResult>;
			if (form.valid && action.accHeader) {
				const accHeader = action.accHeader;
				updateAccomplishmentHeader(accHeader.id, accHeader);
				showSuccessToast(`Succesfully updated accomplishment header ${accHeader.title}`);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: {
						...accHeader
					},
					newState: {
						...accHeader
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	$formData.id = accHeader.id;
	$formData.title = accHeader.title;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error updating accomplishment header: ${$message.text}`);
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
		'Administration',
		'Personnel Development'
	];
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} />Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Add accomplishment report header</Dialog.Title>
			<Dialog.Description>
				Accomplishment report headers are Key areas supporting institutional growth, including
				instruction, research, community management, faculty development, infrastructure,
				international linkages, and administration.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateaccheader" method="POST" use:enhance class="space-y-6">
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
