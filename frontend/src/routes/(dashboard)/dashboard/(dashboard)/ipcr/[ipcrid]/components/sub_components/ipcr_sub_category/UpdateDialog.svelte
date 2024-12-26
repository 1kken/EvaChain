<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import AutoCompleteOfflineInput from '$lib/custom_components/AutoCompleteOfflineInput.svelte';
	import type { IPCRFunctionSubCategoryFormResult } from '../../../utils/types';
	import { getIpcrFunctionSubCategoryFormContext } from '../../../states/ipcr_sub_category_form_state';
	import { getIpcrFunctionSubCategoryStore } from '../../../states/ipcr_sub_category_state';
	import {
		createIpcrFunctionSubCategorySchema,
		updateIpcrFunctionSubCategorySchema
	} from '../../../schema/ipcr_sub_category_schema';
	import type { Tables } from '$lib/types/database.types';

	//props
	interface Iprops {
		ipcrSubCategory: Tables<'ipcr_function_sub_category'>;
		isDrawerOpen: boolean;
	}

	let { ipcrSubCategory, isDrawerOpen = $bindable() }: Iprops = $props();

	//stores
	const { updateForm } = getIpcrFunctionSubCategoryFormContext();
	const { currentIpcrFunctionSubCategories, updateIpcrFunctionSubCategory } =
		getIpcrFunctionSubCategoryStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateIpcrFunctionSubCategorySchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentIpcrFunctionSubCategories.some((subCategory) => {
					return (
						subCategory.sub_category.toLowerCase() === form.data.sub_category.toLowerCase() &&
						subCategory.id !== ipcrSubCategory.id
					);
				})
			) {
				setError(form, 'sub_category', 'Sub category already exists');
			}
			const action = result.data as FormResult<IPCRFunctionSubCategoryFormResult>;
			if (form.valid && action.ipcrFunctionSubCategory) {
				const ipcrFunctionSubCategory = action.ipcrFunctionSubCategory;
				updateIpcrFunctionSubCategory(ipcrFunctionSubCategory.id, ipcrFunctionSubCategory);
				showSuccessToast(`Succesfully added ipcr function sub category!`);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: { ...form.data },
					newState: { ...form.data }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	$formData.sub_category = ipcrSubCategory.sub_category;
	$formData.id = ipcrSubCategory.id;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding ipcr function: ${$message.text}`);
		}
	});

	//for auto complete input
	let items = ['Core Functions', 'Strategic Functions', 'Support Functions', 'Faculty Development'];
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none" id="nav-2">
		<span class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			<span class="hidden md:inline">Add Sub Category</span>
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>IPCR Sub Category</Dialog.Title>
			<Dialog.Description>
				A subcategory in IPCR is a specific, measurable task or responsibility under a broader
				performance category.
				<br />
				<span> *You can still add unspecified values beyond the given ones as you type.* </span>
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createipcrfunctionsubcategory" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
			<Form.Field {form} name="sub_category">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Sub Category</Form.Label>
						<AutoCompleteOfflineInput
							{items}
							bind:text={$formData.sub_category}
							name={props.name}
							placeholder={'Type Ipcr fucntion sub category here'}
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
