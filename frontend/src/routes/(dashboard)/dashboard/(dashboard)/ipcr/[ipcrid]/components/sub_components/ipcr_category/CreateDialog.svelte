<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Save } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import SuperDebug, { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import AutoCompleteOfflineInput from '$lib/custom_components/AutoCompleteOfflineInput.svelte';
	import type { IPCRFunctionCategoryFormResult } from '../../../utils/types';
	import { getIpcrFunctionCategoryStore } from '../../../states/ipcr_category_state';
	import { getIpcrFunctionCategoryFormContext } from '../../../states/ipcr_category_form_state';
	import { createIpcrFunctionCategorySchema } from '../../../schema/ipcr_category_schema';
	import { Input } from '$lib/components/ui/input';
	import AutoCompleteOnlineInput from '$lib/custom_components/AutoCompleteOnlineInput.svelte';
	import { fetchProfileByname } from '../../../utils/page_loader_services';
	import { browser } from '$app/environment';

	//props
	interface Iprops {
		ipcrFunctionId: string;
		isDrawerOpen: boolean;
	}
	let { ipcrFunctionId, isDrawerOpen = $bindable() }: Iprops = $props();
	//stores
	const { createForm } = getIpcrFunctionCategoryFormContext();
	const { currentIpcrFunctionCategories, addIpcrFunctionCategory, size } =
		getIpcrFunctionCategoryStore();

	//states
	let isOpen = $state(false);
	//form
	const form = superForm(createForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(createIpcrFunctionCategorySchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentIpcrFunctionCategories.some(
					(cat) => cat.category.toLowerCase() === form.data.category.toLowerCase()
				)
			) {
				setError(form, 'category', 'Category already exists');
			}
			const action = result.data as FormResult<IPCRFunctionCategoryFormResult>;
			if (form.valid && action.ipcrFunctionCategory) {
				const ipcrFunctionCategory = action.ipcrFunctionCategory;
				addIpcrFunctionCategory(ipcrFunctionCategory);
				showSuccessToast(
					`Succesfully added ipcr function category ${ipcrFunctionCategory.category}`
				);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: { ipcr_function_id: ipcrFunctionId, position: $size + 1 },
					newState: { ipcr_function_id: ipcrFunctionId, position: $size + 1 }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	$formData.ipcr_function_id = ipcrFunctionId;
	$formData.position = $size + 1;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding ipcr function: ${$message.text}`);
		}
	});

	//for auto complete input
	let items = [
		'Higher Education Services',
		'Advanced Education Services',
		'Research Services',
		'Technical Advisory and Extension Services',
		'Administrative Designation',
		'General Administration and Support '
	];
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="items-center focus-visible:outline-none" id="nav-2">
		<span class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			<span class="md:inline">Add Category</span>
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Add IPCR Function Category</Dialog.Title>
			<Dialog.Description>
				Classifies responsibilities like higher education, advanced education services, and related
				tasks.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createipcrfunctioncategory" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input hidden name="ipcr_function_id" value={$formData.ipcr_function_id} />
			<div class=" grid gap-2 md:grid-cols-2">
				<Form.Field {form} name="category">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Add Function Category</Form.Label>
							<AutoCompleteOfflineInput
								{items}
								bind:text={$formData.category}
								name={props.name}
								placeholder={'Type IPCR Function Category here'}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="unit">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Units</Form.Label>
							<Input
								type="number"
								step="0.1"
								placeholder={'Enter Number of Units for this category...'}
								{...props}
								bind:value={$formData.unit}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<Form.Field {form} name="immediate_supervisor_id">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Immediate Supervisor</Form.Label>
						<AutoCompleteOnlineInput
							bind:selectedId={$formData.immediate_supervisor_id}
							name={props.name}
							placeholder={'Type Immediate Supervisor here'}
							onSearch={fetchProfileByname}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="flex w-full justify-end">
				{#if $delayed}
					<Form.Button disabled class="w-full"
						><LoaderCircle class="animate-spin" />Processing...</Form.Button
					>
				{:else}
					<Form.Button class="w-full"><Save />Save</Form.Button>
				{/if}
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
