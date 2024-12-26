<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import SuperDebug, { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import AutoCompleteOfflineInput from '$lib/custom_components/AutoCompleteOfflineInput.svelte';
	import type { IPCRFunctionCategoryFormResult } from '../../../utils/types';
	import { getIpcrFunctionCategoryStore } from '../../../states/ipcr_category_state';
	import { getIpcrFunctionCategoryFormContext } from '../../../states/ipcr_category_form_state';
	import {
		createIpcrFunctionCategorySchema,
		updateIpcrFunctionCategorySchema
	} from '../../../schema/ipcr_category_schema';
	import { Input } from '$lib/components/ui/input';
	import AutoCompleteOnlineInput from '$lib/custom_components/AutoCompleteOnlineInput.svelte';
	import { fetchProfileById, fetchProfileByname } from '../../../utils/page_loader_services';
	import { browser } from '$app/environment';
	import type { Tables } from '$lib/types/database.types';

	//props
	interface Iprops {
		ipcrFunctionCategory: Tables<'ipcr_function_category'>;
		isDrawerOpen: boolean;
	}
	let { ipcrFunctionCategory, isDrawerOpen = $bindable() }: Iprops = $props();

	//stores
	const { updateForm } = getIpcrFunctionCategoryFormContext();
	const { currentIpcrFunctionCategories, updateIpcrFunctionCategory } =
		getIpcrFunctionCategoryStore();

	//states
	let isOpen = $state(false);
	//form
	const form = superForm(updateForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(updateIpcrFunctionCategorySchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentIpcrFunctionCategories.some((cat) => {
					return (
						cat.category.toLowerCase() === form.data.category.toLowerCase() &&
						cat.id !== form.data.id
					);
				})
			) {
				console.log(form.data.id);
				setError(form, 'category', 'Category already exists');
			}
			const action = result.data as FormResult<IPCRFunctionCategoryFormResult>;
			if (form.valid && action.ipcrFunctionCategory) {
				const ipcrFunctionCategory = action.ipcrFunctionCategory;
				updateIpcrFunctionCategory(ipcrFunctionCategory.id, ipcrFunctionCategory);
				showSuccessToast(
					`Succesfully update ipcr function category ${ipcrFunctionCategory.category}`
				);
				isOpen = false;
				reset({
					data: {
						id: ipcrFunctionCategory.id,
						category: ipcrFunctionCategory.category,
						unit: ipcrFunctionCategory.unit,
						immediate_supervisor_id: ipcrFunctionCategory.immediate_supervisor_id
					},
					newState: {
						id: ipcrFunctionCategory.id,
						category: ipcrFunctionCategory.category,
						unit: ipcrFunctionCategory.unit,
						immediate_supervisor_id: ipcrFunctionCategory.immediate_supervisor_id
					}
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	$formData.id = ipcrFunctionCategory.id;
	$formData.category = ipcrFunctionCategory.category;
	$formData.unit = ipcrFunctionCategory.unit;
	$formData.immediate_supervisor_id = ipcrFunctionCategory.immediate_supervisor_id;

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
	<Dialog.Content
		class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]"
		onOpenAutoFocus={(e) => e.preventDefault()}
	>
		<Dialog.Header>
			<Dialog.Title>Add IPCR Function Category</Dialog.Title>
			<Dialog.Description>
				Classifies responsibilities like higher education, advanced education services, and related
				tasks.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updateipcrfunctioncategory" method="POST" use:enhance class="space-y-6">
			<input hidden name="id" value={$formData.id} />
			<div class=" grid gap-2 md:grid-cols-2">
				<Form.Field {form} name="category">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Update Function Category</Form.Label>
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
							onFetchById={fetchProfileById}
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
