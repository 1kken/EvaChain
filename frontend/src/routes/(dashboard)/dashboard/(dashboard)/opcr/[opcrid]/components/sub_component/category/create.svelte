<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Save } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import SuperDebug, { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import AutoCompleteOfflineInput from '$lib/custom_components/AutoCompleteOfflineInput.svelte';
	import { getOpcrCategoryFormContext } from '../../../states/category_form_state';
	import { getOpcrCategoryStore } from '../../../states/category_state';
	import { createOpcrCategorySchema } from '../../../schema/category_schema';
	import type { OPCRCategoryFormResult } from '../../../utils/types';
	import { browser } from '$app/environment';

	//props
	interface Iprops {
		opcrFunctionId: string;
		isAddDrawerOpen: boolean;
	}
	let { opcrFunctionId, isAddDrawerOpen = $bindable() }: Iprops = $props();
	//stores
	const { createForm } = getOpcrCategoryFormContext();
	const { currentOpcrCategories, addOpcrCategory, size } = getOpcrCategoryStore();

	//states
	let isOpen = $state(false);
	//form
	const form = superForm(createForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(createOpcrCategorySchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentOpcrCategories.find(
					(category) =>
						category.category.toLocaleLowerCase() === form.data.category.toLocaleLowerCase()
				)
			) {
				setError(form, 'category', 'Category already exists');
			}
			const action = result.data as FormResult<OPCRCategoryFormResult>;
			if (form.valid && action.opcrCategory) {
				const opcrCategory = action.opcrCategory;
				addOpcrCategory(opcrCategory);
				showSuccessToast(`Succesfully added OPCR category ${opcrCategory.category}`);
				isOpen = false;
				isAddDrawerOpen = false;
				reset({
					data: { opcr_function_id: opcrFunctionId, position: $size + 1 },
					newState: { opcr_function_id: opcrFunctionId, position: $size + 1 }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	$formData.opcr_function_id = opcrFunctionId;
	$formData.position = $size + 1;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding opcr function: ${$message.text}`);
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
			<Dialog.Title>Add OPCR Function Category</Dialog.Title>
			<Dialog.Description>
				Classifies responsibilities like higher education, advanced education services, and related
				tasks.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createopcrcategory" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input hidden name="dpcr_function_id" value={$formData.opcr_function_id} />
			<div>
				<Form.Field {form} name="category">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Add Function Category</Form.Label>
							<AutoCompleteOfflineInput
								{items}
								bind:text={$formData.category}
								name={props.name}
								placeholder={'Higher Education Services, Advanced Education Services...'}
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
