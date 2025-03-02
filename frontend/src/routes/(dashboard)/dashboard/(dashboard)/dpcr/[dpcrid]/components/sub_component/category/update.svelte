<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil, Save } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import SuperDebug, { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import AutoCompleteOfflineInput from '$lib/custom_components/AutoCompleteOfflineInput.svelte';
	import { getDpcrCategoryStore } from '../../../states/category_state';
	import { getDpcrCategoryFormContext } from '../../../states/category_form_state';
	import {
		createDpcrCategorySchema,
		updateDpcrCategorySchema
	} from '../../../schema/category_schema';
	import type { DPCRCategoryFormResult } from '../../../utils/types';
	import type { Tables } from '$lib/types/database.types';

	//props
	interface Iprops {
		dpcrCategory: Tables<'dpcr_function_category'>;
		isDrawerOpen: boolean;
	}
	let { dpcrCategory, isDrawerOpen = $bindable() }: Iprops = $props();
	//stores
	const { updateForm } = getDpcrCategoryFormContext();
	const { currentDpcrCategories, updateDpcrCategory } = getDpcrCategoryStore();

	//states
	let isOpen = $state(false);
	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateDpcrCategorySchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentDpcrCategories.find(
					(category) =>
						category.category.toLocaleLowerCase() === form.data.category.toLocaleLowerCase() &&
						category.id !== dpcrCategory.id
				)
			) {
				setError(form, 'category', 'Category already exists');
			}
			const action = result.data as FormResult<DPCRCategoryFormResult>;
			if (form.valid && action.dpcrCategory) {
				const dpcrCategory = action.dpcrCategory;
				updateDpcrCategory(dpcrCategory.id, dpcrCategory);
				showSuccessToast(`Succesfully updated DPCR category ${dpcrCategory.category}`);
				isOpen = false;
				isDrawerOpen = false;
				reset({
					data: {
						...dpcrCategory
					},
					newState: {
						...dpcrCategory
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	$formData = dpcrCategory;
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
	<Dialog.Trigger class="focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} />Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Update DPCR Function Category</Dialog.Title>
			<Dialog.Description>
				Classifies responsibilities like higher education, advanced education services, and related
				tasks.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updatedpcrcategory" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
			<div>
				<Form.Field {form} name="category">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Add Function Category</Form.Label>
							<AutoCompleteOfflineInput
								{items}
								bind:text={$formData.category}
								name={props.name}
								placeholder={'Higher Education Services etc...'}
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
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
