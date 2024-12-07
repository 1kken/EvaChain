# [ipcrid]/(components)/(body)/(core_function)/(subcomponents)/(create_dialogs)/CoreFunctionCreateDialog.svelte

```svelte
<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Plus } from 'lucide-svelte';
	import { getCoreFunctionFormContext } from '../../../../(data)/(forms)/core_function_form.svelte';
	import SuperDebug, { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { createCoreFunctionSchema } from '../../../../(data)/(schema)/core_function_schema';
	import { getIPCRStore } from '../../../../../../(data)/state.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { CoreFunctionFormResult } from '../../../../(data)/types';
	import { showSuccessToast } from '$lib/utils/toast';
	import { getCoreFunctionStore } from '../../../../(data)/(state)/corefunctionstate.svelte';
	import { browser } from '$app/environment';

	let { ipcrId }: { ipcrId: string } = $props();
	let isOpen = $state(false);
	let suggestions: { id: string; display: string }[] = $state([]);
	let displayName = $state('');
	const { createCoreFunctionForm: data } = getCoreFunctionFormContext();
	const coreFunctionStore = getCoreFunctionStore();
	const { size } = coreFunctionStore;
	const form = superForm(data!, {
		dataType: 'json',
		validators: zodClient(createCoreFunctionSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<CoreFunctionFormResult>;
			if (form.valid && action && coreFunctionStore) {
				const coreFunction = action.coreFunction;
				coreFunctionStore.addCoreFunction(coreFunction);
				showSuccessToast(`Succesfully added core function ${coreFunction.name}`);
				const ipcrId = $formData.ipcr_teaching_id; // Save ID before reset
				isOpen = false;
				reset({
					data: { ipcr_teaching_id: ipcrId, position: $size },
					newState: { ipcr_teaching_id: ipcrId, position: $size }
				});
				displayName = '';
			}
		}
	});

	const { currentUserIPCR } = getIPCRStore();
	const { form: formData, enhance, delayed, message, reset } = form;
	$effect(() => {
		const currentIpcr = $currentUserIPCR.find((c) => c.id === ipcrId);
		$formData.position = $size;
		if (currentIpcr) {
			$formData.ipcr_teaching_id = currentIpcr.id;
		}
		if ($message?.status === 'success') {
			showSuccessToast($message.text);
		}
		if ($message?.status === 'error') {
			showSuccessToast($message.text);
		}
	});

	let isLoading = $state(false);
	let searched = $state(false);

	async function search(e: Event) {
		try {
			const search = (e.target as HTMLInputElement).value;
			searched = false;

			if (search.length < 3) {
				suggestions = [];
				return;
			}

			isLoading = true;

			const response = await fetch('/dashboard/ipcr', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ search })
			});

			if (!response.ok) {
				throw new Error('Search failed');
			}

			const data = await response.json();
			suggestions = data.suggestions;
			searched = true;
		} catch (error) {
			console.error('Search error:', error);
			suggestions = [];
		} finally {
			isLoading = false;
		}
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
		<span class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			<span class="hidden md:inline">Add Core Function</span>
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Create Core Function</Dialog.Title>
			<Dialog.Description>
				A core function is a main responsibility area in your role with an assigned weight (unit)
				for performance evaluation. It represents primary duties that contribute to reaching
				organizational goals.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createcorefunction" method="POST" use:enhance class="space-y-6">
			<input hidden name="index" value={$formData.position} />
			<input hidden name="ipcr_etaching_id" value={$formData.ipcr_teaching_id} />
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Title</Form.Label>
						<Input {...props} bind:value={$formData.name} />
						<Form.Description>This is the title of the core function.</Form.Description>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="grid grid-cols-2 gap-2">
				<Form.Field {form} name="unit">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Unit</Form.Label>
							<Input type="number" step="0.1" {...props} bind:value={$formData.unit} />
							<Form.Description
								>A unit represents your credit allocation for each core function in your performance
								evaluation.</Form.Description
							>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="reviewer_id">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Reviewer Name</Form.Label>
							<div class="relative">
								<Input type="hidden" {...props} />
								<Input
									bind:value={displayName}
									oninput={async (e) => {
										await search(e);
									}}
								/>
								<div class="absolute right-3 top-1/2 -translate-y-1/2">
									{#if isLoading}
										<LoaderCircle class="h-4 w-4 animate-spin text-gray-400" />
									{/if}
								</div>

								{#if suggestions.length > 0}
									<div class="absolute z-10 mt-1 w-full rounded-md bg-green-900 shadow-lg">
										{#each suggestions as suggestion}
											<Button
												variant="ghost"
												class="w-full justify-start px-4 py-2 text-left hover:bg-green-700"
												onclick={() => {
													$formData.reviewer_id = suggestion.id;
													displayName = suggestion.display;
													suggestions = [];
												}}
											>
												{suggestion.display}
											</Button>
										{/each}
									</div>
								{:else if displayName.length >= 3 && !isLoading && searched && $formData.reviewer_id === null}
									<div
										class="absolute z-10 mt-1 w-full rounded-md border bg-white p-4 text-center text-gray-500 shadow-lg"
									>
										No users found
									</div>
								{/if}
							</div>
							<Form.Description>Enter the name of the reviewer.</Form.Description>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="flex w-full justify-end">
				{#if $delayed}
					<Form.Button disabled><LoaderCircle class="animate-spin" />Processing...</Form.Button>
				{:else}
					<Form.Button>Submit</Form.Button>
				{/if}
			</div>
		</form>
		{#if browser}
			<SuperDebug data={$formData} />
		{/if}
	</Dialog.Content>
</Dialog.Root>

```

# [ipcrid]/(components)/(body)/(core_function)/(subcomponents)/(create_dialogs)/SubCoreFunctionCreateDialog.svelte

```svelte
<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Plus } from 'lucide-svelte';
	import { getSubCoreFunctionFormContext } from '../../../../(data)/(forms)/sub_core_function_form.svelte';
	interface Props {
		coreFunctionId: string;
	}
	let { coreFunctionId }: Props = $props();

	const { createSubCoreFunctionForm } = getSubCoreFunctionFormContext();
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
		<span class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			<span class="hidden md:inline">Add Sub Core Function</span>
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edit profile</Dialog.Title>
			<Dialog.Description>
				Make changes to your profile here. Click save when you're done.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Name</Label>
				<Input id="name" value="Pedro Duarte" class="col-span-3" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="username" class="text-right">Username</Label>
				<Input id="username" value="@peduarte" class="col-span-3" />
			</div>
		</div>
		<Dialog.Footer>
			<Button type="submit">Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

```

# [ipcrid]/(components)/(body)/(core_function)/(subcomponents)/(create_dialogs)/SubCoreFunctionIndicatorCreateDialog.svelte

```svelte
<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Plus } from 'lucide-svelte';
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
		<Plus class="h-5 w-5" /> <span>Add Target</span>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edit profile</Dialog.Title>
			<Dialog.Description>
				Make changes to your profile here. Click save when you're done.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Name</Label>
				<Input id="name" value="Pedro Duarte" class="col-span-3" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="username" class="text-right">Username</Label>
				<Input id="username" value="@peduarte" class="col-span-3" />
			</div>
		</div>
		<Dialog.Footer>
			<Button type="submit">Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

```

# [ipcrid]/(components)/(body)/(core_function)/(subcomponents)/(delete_actions)/DeleteActionCoreFunction.svelte

```svelte
<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { showErrorToast, showWarningToast } from '$lib/utils/toast';
	import { superForm, type FormResult, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { LoaderCircle } from 'lucide-svelte';
	import { TriangleAlert } from 'lucide-svelte';
	import { Trash2 } from 'lucide-svelte';
	// import { deleteIPCRSchema, type DeleteIPCRSchema } from '../(data)/schema';
	import { getAuthStore } from '$lib/utils/authStore';
	import { goto, invalidateAll } from '$app/navigation';
	import {
		deleteCoreFunctionSchema,
		type DeleteCoreFunctionSchema
	} from '../../../../(data)/(schema)/core_function_schema';
	import { getCoreFunctionStore } from '../../../../(data)/(state)/corefunctionstate.svelte';
	import type { CoreFunctionFormResult } from '../../../../(data)/types';
	import { getCoreFunctionFormContext } from '../../../../(data)/(forms)/core_function_form.svelte';
	interface Props {
		id: string;
		isDrawerOpen: boolean;
	}
	const { currentCoreFunctions, removeCoreFunction } = getCoreFunctionStore();

	let { id, isDrawerOpen = $bindable() }: Props = $props();
	const { deleteCoreFunctionForm: data } = getCoreFunctionFormContext();
	const form = superForm(data, {
		validators: zodClient(deleteCoreFunctionSchema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<CoreFunctionFormResult>;
			if (form.valid && action) {
				const core_function = action.coreFunction;
				removeCoreFunction(core_function.id);
				showWarningToast(`Succesfully deleted IPCR ${core_function.name}`);
				isDrawerOpen = false;
			}
		}
	});
	const { form: formData, enhance, delayed } = form;
	let isOpen = $state(false);
	const currentCoreFunction = $currentCoreFunctions.find((c) => c.id === id);
	let name = $state('');
	if (currentCoreFunction) {
		$formData.id = currentCoreFunction.id;
		$formData.expectedTitle = currentCoreFunction.name;
		name = currentCoreFunction.name;
	}
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
		<form method="POST" action="?/deletecorefunction" use:enhance>
			<input hidden value={$formData.owner_id} name="owner_id" />
			<Input name="id" class="hidden" bind:value={$formData.id} />
			<Form.Field {form} name="confirmTitle">
				<Form.FieldErrors />
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Please Confirm</Form.Label>
						<Input {...props} bind:value={$formData.confirmTitle} />
					{/snippet}
				</Form.Control>
				<Form.Description
					>Please type <span class=" font-bold">{name}</span> to proceed.
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

```

# [ipcrid]/(components)/(body)/(core_function)/(subcomponents)/(update_dialogs)/CoreFunctionUpdateDialog.svelte

```svelte
<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil } from 'lucide-svelte';
	import { getCoreFunctionFormContext } from '../../../../(data)/(forms)/core_function_form.svelte';
	import { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { updateCoreFunctionSchema } from '../../../../(data)/(schema)/core_function_schema';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { CoreFunctionFormResult } from '../../../../(data)/types';
	import { showSuccessToast } from '$lib/utils/toast';
	import { getCoreFunctionStore } from '../../../../(data)/(state)/corefunctionstate.svelte';

	let {
		coreFunctionId,
		isDrawerOpen = $bindable()
	}: { coreFunctionId: string; isDrawerOpen: boolean } = $props();
	let isOpen = $state(false);
	let suggestions: { id: string; display: string }[] = $state([]);
	let displayName = $state('');

	const { updateCoreFunctionForm: data } = getCoreFunctionFormContext();
	const { currentCoreFunctions, updateCoreFunction } = getCoreFunctionStore();
	const form = superForm(data!, {
		dataType: 'json',
		validators: zodClient(updateCoreFunctionSchema),
		multipleSubmits: 'prevent',
		resetForm: false,
		onUpdate({ form, result }) {
			const action = result.data as FormResult<CoreFunctionFormResult>;
			if (form.valid && action && currentCoreFunction) {
				const coreFunction = action.coreFunction;
				updateCoreFunction(coreFunctionId, coreFunction);
				showSuccessToast(`Succesfully added core function ${coreFunction.name}`);
				displayName = '';
				isOpen = false;
				isDrawerOpen = false;
			}
		}
	});

	const currentCoreFunction = $currentCoreFunctions.find((c) => c.id === coreFunctionId);
	const { form: formData, enhance, delayed, message, reset } = form;
	$effect(() => {
		if (currentCoreFunction) {
			$formData.id = coreFunctionId;
			$formData.name = currentCoreFunction.name;
			$formData.unit = currentCoreFunction.unit;
			$formData.reviewer_id = currentCoreFunction.reviewer_id ?? undefined;
			if (currentCoreFunction.reviewer_id) {
				fetchReviewer(currentCoreFunction.reviewer_id);
			}
		}
		if ($message?.status === 'error') {
			showSuccessToast($message.text);
		}
	});

	let isLoading = $state(false);
	let searched = $state(false);

	async function search(e: Event) {
		try {
			const search = (e.target as HTMLInputElement).value;
			searched = false;

			if (search.length < 3) {
				suggestions = [];
				return;
			}

			isLoading = true;

			const response = await fetch('/dashboard/ipcr', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ search })
			});

			if (!response.ok) {
				throw new Error('Search failed');
			}

			const data = await response.json();
			suggestions = data.suggestions;
			searched = true;
		} catch (error) {
			console.error('Search error:', error);
			suggestions = [];
		} finally {
			isLoading = false;
		}
	}

	async function fetchReviewer(userId: string) {
		try {
			const response = await fetch(`/api/profiles?userId=${userId}`);
			if (!response.ok) {
				throw new Error('Failed to fetch reviewer');
			}
			const { profile } = await response.json();
			displayName = [
				profile.first_name,
				profile.middle_name ? `${profile.middle_name.charAt(0)}.` : '',
				profile.last_name
			]
				.filter(Boolean)
				.join(' ');
		} catch (error) {
			console.error('Error fetching reviewer:', error);
			displayName = '';
		}
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} />Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Create Core Function</Dialog.Title>
			<Dialog.Description>
				A core function is a main responsibility area in your role with an assigned weight (unit)
				for performance evaluation. It represents primary duties that contribute to reaching
				organizational goals.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updatecorefunction" method="POST" use:enhance class="space-y-6">
			<input name="id" value={$formData.id} hidden />
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Title</Form.Label>
						<Input {...props} bind:value={$formData.name} />
						<Form.Description>This is the title of the core function.</Form.Description>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="grid grid-cols-2 gap-2">
				<Form.Field {form} name="unit">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Unit</Form.Label>
							<Input type="number" step="0.1" {...props} bind:value={$formData.unit} />
							<Form.Description
								>A unit represents your credit allocation for each core function in your performance
								evaluation.</Form.Description
							>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="reviewer_id">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Reviewer Name</Form.Label>
							<div class="relative">
								<Input type="hidden" {...props} />
								<Input
									bind:value={displayName}
									oninput={async (e) => {
										await search(e);
									}}
								/>
								<div class="absolute right-3 top-1/2 -translate-y-1/2">
									{#if isLoading}
										<LoaderCircle class="h-4 w-4 animate-spin text-gray-400" />
									{/if}
								</div>

								{#if suggestions.length > 0}
									<div class="absolute z-10 mt-1 w-full rounded-md bg-green-900 shadow-lg">
										{#each suggestions as suggestion}
											<Button
												variant="ghost"
												class="w-full justify-start px-4 py-2 text-left hover:bg-green-700"
												onclick={() => {
													$formData.reviewer_id = suggestion.id;
													displayName = suggestion.display;
													suggestions = [];
												}}
											>
												{suggestion.display}
											</Button>
										{/each}
									</div>
								{:else if displayName.length >= 3 && !isLoading && searched && $formData.reviewer_id === null}
									<div
										class="absolute z-10 mt-1 w-full rounded-md border bg-white p-4 text-center text-gray-500 shadow-lg"
									>
										No users found
									</div>
								{/if}
							</div>
							<Form.Description>Enter the name of the reviewer.</Form.Description>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
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

```

# [ipcrid]/(components)/(body)/(core_function)/(subcomponents)/DropDownWrapper.svelte

```svelte
<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { CircleEllipsis } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		deleteAction: Snippet;
		updateDialog: Snippet;
		isDrawerOpen: boolean;
	}

	let { deleteAction, updateDialog, isDrawerOpen = $bindable() }: Props = $props();
</script>

<DropdownMenu.Root bind:open={isDrawerOpen}>
	<DropdownMenu.Trigger class="hover:rotate-90"><CircleEllipsis /></DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			<DropdownMenu.Item
				onSelect={(e) => {
					e.preventDefault();
				}}
			>
				{@render deleteAction()}
			</DropdownMenu.Item>
			<DropdownMenu.Item
				onSelect={(e) => {
					e.preventDefault();
				}}
			>
				{@render updateDialog()}
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

```

# [ipcrid]/(components)/(body)/(core_function)/CoreFunction.svelte

```svelte
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronDown, LoaderCircle } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import debounce from 'debounce';
	import { dndzone } from 'svelte-dnd-action';
	import type { DndEvent } from 'svelte-dnd-action';
	import type { Tables } from '$lib/types/database.types';
	import CoreFunctionCreateDialog from './(subcomponents)/(create_dialogs)/CoreFunctionCreateDialog.svelte';
	import SubCoreFunction from './SubCoreFunction.svelte';
	import { getCoreFunctionStore } from '../../(data)/(state)/corefunctionstate.svelte';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';

	type CoreFunction = Tables<'core_function'>;

	const { currentCoreFunctions } = getCoreFunctionStore();
	let isExpanded = $state(false);
	let isUpdating = $state(false);
	let flipDurationMs = 300;
	let dndItems = $state<CoreFunction[]>([]);

	let { currentIpcrId }: { currentIpcrId: string } = $props();

	// Sync dndItems with store
	$effect(() => {
		dndItems = [...$currentCoreFunctions];
	});

	const updateCoreFunctionPositions = debounce(async (items: CoreFunction[]) => {
		try {
			const response = await fetch('/api/core_function', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(items)
			});
			if (!response.ok) {
				throw new Error('Failed to update positions');
			}

			const result = await response.json();
			return result.data;
		} catch (error) {
			console.error('Error updating positions:', error);
			throw error;
		}
	}, 2000);

	function handleDndConsider(e: CustomEvent<DndEvent<CoreFunction>>) {
		const updatedItems = e.detail.items.map((item, index) => ({
			...item,
			position: (index + 1) * 100
		}));
		dndItems = updatedItems;
	}

	async function handleDndFinalize(e: CustomEvent<DndEvent<CoreFunction>>) {
		try {
			isUpdating = true;
			const updatedItems = e.detail.items.map((item, index) => ({
				...item,
				position: (index + 1) * 100
			}));

			await updateCoreFunctionPositions(updatedItems);
			$currentCoreFunctions = updatedItems;
			showSuccessToast('Updated Core Function Position');
		} catch (error) {
			console.error('Failed to update positions:', error);
			showErrorToast('Failed to update order. Please try again.');
			dndItems = [...$currentCoreFunctions];
		} finally {
			isUpdating = false;
		}
	}

	function toggleExpand() {
		isExpanded = !isExpanded;
	}
</script>

<div class="w-full">
	<header class="sticky top-0 flex h-16 items-center justify-between border-b px-4 md:px-10">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" onclick={toggleExpand}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<h2 class="text-base font-bold md:text-xl">CORE FUNCTIONS</h2>
		</div>
		<CoreFunctionCreateDialog ipcrId={currentIpcrId} />
	</header>
</div>

{#if isExpanded}
	<div
		class="relative space-y-4 px-4 pt-4 md:pl-14 md:pr-10"
		use:dndzone={{ items: dndItems, flipDurationMs }}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
	>
		{#if isUpdating}
			<div class="absolute right-2 top-2">
				<LoaderCircle class="h-4 w-4 animate-spin" />
			</div>
		{/if}

		{#if dndItems.length === 0}
			<h1>No Core functions found</h1>
		{:else}
			{#each dndItems as coreFunction (coreFunction.id)}
				<SubCoreFunction
					name={coreFunction.name}
					units={coreFunction.unit}
					coreFunctionId={coreFunction.id}
				/>
			{/each}
		{/if}
	</div>
{/if}

```

# [ipcrid]/(components)/(body)/(core_function)/CoreFunctionIndicator.svelte

```svelte
<script lang="ts">
	import { ChevronDown, Plus } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import SubCoreFunctionIndicatorCreateDialog from './(subcomponents)/(create_dialogs)/SubCoreFunctionIndicatorCreateDialog.svelte';

	// Props
	let { name }: { name: string } = $props();

	// States
	let isExpanded: boolean = $state(false);
	let targets: number[] = $state([0]); // Initialize with one target

	/** Toggle expansion */
	const toggleExpand = () => {
		isExpanded = !isExpanded;
	};
</script>

<div class="rounded-lg border">
	<div class="flex min-h-[3.5rem] items-center justify-between p-3">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" class="hidden md:flex" onclick={toggleExpand}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<h4 class="font-medium">{name}</h4>
		</div>
		<SubCoreFunctionIndicatorCreateDialog />
	</div>

	{#if isExpanded}
		<div class="border-t p-3">
			{#each targets as index}
				{index}
			{/each}
		</div>
	{/if}
</div>

```

# [ipcrid]/(components)/(body)/(core_function)/SubCoreFunction.svelte

```svelte
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { ChevronDown, Plus } from 'lucide-svelte';
	import SubCoreFunctionCreateDialog from './(subcomponents)/(create_dialogs)/SubCoreFunctionCreateDialog.svelte';
	import CoreFunctionIndicator from './CoreFunctionIndicator.svelte';
	import DeleteActionCoreFunction from './(subcomponents)/(delete_actions)/DeleteActionCoreFunction.svelte';
	import DropDownWrapper from './(subcomponents)/DropDownWrapper.svelte';
	import CoreFunctionUpdateDialog from './(subcomponents)/(update_dialogs)/CoreFunctionUpdateDialog.svelte';

	// Props
	let {
		name,
		units,
		coreFunctionId
	}: { name: string; units?: number | null; coreFunctionId: string } = $props();

	let isExpanded: boolean = $state(false);
	let isDrawerOpen: boolean = $state(false);

	const toggleExpand = () => {
		isExpanded = !isExpanded;
	};
</script>

<div class="rounded-lg border">
	<div class="flex min-h-[4rem] items-center justify-between p-4">
		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" onclick={toggleExpand}>
				<ChevronDown
					class={cn(
						'h-5 w-5 text-gray-500 transition-transform duration-200',
						isExpanded && 'rotate-180'
					)}
				/>
			</Button>
			<div>
				<h3 class="text-sm font-semibold md:text-base">{name}</h3>
				<p class="text-muted-foreground text-xs md:text-sm">({!units ? ' _' : units} units)</p>
			</div>
		</div>
		{#snippet deleteAction()}
			<DeleteActionCoreFunction id={coreFunctionId} bind:isDrawerOpen />
		{/snippet}
		{#snippet updateDialog()}
			<CoreFunctionUpdateDialog {coreFunctionId} bind:isDrawerOpen />
		{/snippet}
		<div class="flex gap-4">
			<SubCoreFunctionCreateDialog {coreFunctionId} />
			<DropDownWrapper {deleteAction} {updateDialog} bind:isDrawerOpen />
		</div>
	</div>

	{#if isExpanded}
		<div class="border-t p-4">
			<div class="space-y-4">
				<h1>No Sub-core functions found</h1>
			</div>
		</div>
	{/if}
</div>

```

# [ipcrid]/(components)/(data)/(forms)/core_function_form.svelte.ts

```ts
import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type {
	CreateCoreFunctionSchema,
	DeleteCoreFunctionSchema,
	UpdateCoreFunctionSchema
} from '../(schema)/core_function_schema';
import { getContext, setContext } from 'svelte';

const CORE_FUNCTION_FORM_KEY = Symbol('CORE_FUNCTION_FORM_KEY');

type CoreFunctionForm = {
	updateCoreFunctionForm: SuperValidated<Infer<UpdateCoreFunctionSchema>>;
	deleteCoreFunctionForm: SuperValidated<Infer<DeleteCoreFunctionSchema>>;
	createCoreFunctionForm: SuperValidated<Infer<CreateCoreFunctionSchema>>;
};

export function setCoreFunctionFormContext(forms: CoreFunctionForm) {
	setContext(CORE_FUNCTION_FORM_KEY, forms);
	return forms;
}

export function getCoreFunctionFormContext() {
	const forms = getContext<CoreFunctionForm>(CORE_FUNCTION_FORM_KEY);
	if (!forms?.createCoreFunctionForm) {
		throw new Error('Core Function form not found in context');
	}
	return forms;
}

```

# [ipcrid]/(components)/(data)/(forms)/sub_core_function_form.svelte.ts

```ts
import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type {
	CreateSubCoreFunctionSchema,
	DeleteSubCoreFunctionSchema,
	UpdateSubCoreFunctionSchema
} from '../(schema)/sub_core_function_schema';
import { getContext, setContext } from 'svelte';

const SUB_CORE_FUNCTION_FORM_KEY = Symbol('SUB_CORE_FUNCTION_FORM_KEY');

type SubCoreFunctionForm = {
	updateSubCoreFunctionForm: SuperValidated<Infer<UpdateSubCoreFunctionSchema>>;
	deleteSubCoreFunctionForm: SuperValidated<Infer<DeleteSubCoreFunctionSchema>>;
	createSubCoreFunctionForm: SuperValidated<Infer<CreateSubCoreFunctionSchema>>;
};

export function setSubCoreFunctionFormContext(forms: SubCoreFunctionForm) {
	setContext(SUB_CORE_FUNCTION_FORM_KEY, forms);
	return forms;
}

export function getSubCoreFunctionFormContext() {
	const forms = getContext<SubCoreFunctionForm>(SUB_CORE_FUNCTION_FORM_KEY);
	if (!forms?.createSubCoreFunctionForm) {
		throw new Error('Sub Core Function form not found in context');
	}
	return forms;
}

```

# [ipcrid]/(components)/(data)/(schema)/core_function_schema.ts

```ts
import type { position } from '$lib/states/admin_positions_state.svelte';
import { z } from 'zod';

// Schema for creating a new core function
export const createCoreFunctionSchema = z.object({
	name: z.string().min(1, 'Name is required').max(1000, 'Name must be less than 1000 characters'),

	ipcr_teaching_id: z.string().uuid('Invalid IPCR Teaching ID format'),

	unit: z.number().multipleOf(0.01).min(1, 'Unit must be greater than zero').nullable(),
	position: z.number().min(0),
	reviewer_id: z.string().uuid('Invalid User').nullable()
});

export const updateCoreFunctionSchema = z
	.object({
		id: z.string(),
		name: z
			.string()
			.min(1, 'Name is required')
			.max(1000, 'Name must be less than 1000 characters')
			.optional(),

		unit: z
			.number()
			.multipleOf(0.01)
			.min(1, 'Unit must be greater than zero')
			.optional()
			.nullable(),

		reviewer_id: z.string().uuid('Invalid User').optional()
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: 'At least one field must be provided for update'
	});

export const deleteCoreFunctionSchema = z
	.object({
		id: z.string(),
		confirmTitle: z.string().min(1, 'Please fill in the necessary field'),
		owner_id: z.string(),
		expectedTitle: z.string()
	})
	.refine((data) => data.confirmTitle === data.expectedTitle, {
		message: "The title doesn't match",
		path: ['confirmTitle']
	});

export type DeleteCoreFunctionSchema = typeof deleteCoreFunctionSchema;
export type DeleteCoreFunctionInput = z.infer<typeof deleteCoreFunctionSchema>;
export type CreateCoreFunctionSchema = typeof createCoreFunctionSchema;
export type CreateCoreFunctionInput = z.infer<typeof createCoreFunctionSchema>;
export type UpdateCoreFunctionSchema = typeof updateCoreFunctionSchema;
export type UpdateCoreFunctionSchemaInput = z.infer<typeof updateCoreFunctionSchema>;

```

# [ipcrid]/(components)/(data)/(schema)/sub_core_function_schema.ts

```ts
import { z } from 'zod';

// Schema for creating a new sub core function
export const createSubCoreFunctionSchema = z.object({
	name: z.string().min(1, 'Name is required').max(1000, 'Name must be less than 1000 characters'),
	core_function_id: z.string().uuid('Invalid Core Function ID format')
});

// Schema for updating a sub core function
export const updateSubCoreFunctionSchema = z
	.object({
		id: z.string(),
		name: z
			.string()
			.min(1, 'Name is required')
			.max(1000, 'Name must be less than 1000 characters')
			.optional()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update'
	});

// Schema for deleting a sub core function
export const deleteSubCoreFunctionSchema = z
	.object({
		id: z.string(),
		confirmTitle: z.string().min(1, 'Please fill in the necessary field'),
		owner_id: z.string(),
		expectedTitle: z.string()
	})
	.refine((data) => data.confirmTitle === data.expectedTitle, {
		message: "The title doesn't match",
		path: ['confirmTitle']
	});

// Export types
export type DeleteSubCoreFunctionSchema = typeof deleteSubCoreFunctionSchema;
export type DeleteSubCoreFunctionInput = z.infer<typeof deleteSubCoreFunctionSchema>;
export type CreateSubCoreFunctionSchema = typeof createSubCoreFunctionSchema;
export type CreateSubCoreFunctionInput = z.infer<typeof createSubCoreFunctionSchema>;
export type UpdateSubCoreFunctionSchema = typeof updateSubCoreFunctionSchema;
export type UpdateSubCoreFunctionInput = z.infer<typeof updateSubCoreFunctionSchema>;

```

# [ipcrid]/(components)/(data)/(state)/corefunctionstate.svelte.ts

```ts
import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, derived, type Writable } from 'svelte/store';

const CORE_FUNCTION_STATE_KEY = Symbol('CORE_FUNCTION_STATE_KEY');

type CoreFunctionState = {
	currentCoreFunctions: Writable<Tables<'core_function'>[]>;
	size: Writable<number>;
	addCoreFunction: (coreFunction: Tables<'core_function'>) => void;
	updateCoreFunction: (id: string, updates: Partial<Tables<'core_function'>>) => void;
	removeCoreFunction: (id: string) => void;
};

function createCoreFunctionStore(initialData?: Tables<'core_function'>[]): CoreFunctionState {
	const currentCoreFunctions = writable<Tables<'core_function'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentCoreFunctions changes
	currentCoreFunctions.subscribe((functions) => {
		size.set(functions.length);
	});

	function addCoreFunction(coreFunction: Tables<'core_function'>) {
		currentCoreFunctions.update((functions) => [...functions, coreFunction]);
	}

	function updateCoreFunction(id: string, updates: Partial<Tables<'core_function'>>) {
		currentCoreFunctions.update((functions) =>
			functions.map((func) => (func.id === id ? { ...func, ...updates } : func))
		);
	}

	function removeCoreFunction(id: string) {
		currentCoreFunctions.update((functions) => functions.filter((func) => func.id !== id));
	}

	return {
		currentCoreFunctions,
		size,
		addCoreFunction,
		updateCoreFunction,
		removeCoreFunction
	};
}

export function getCoreFunctionStore(): CoreFunctionState {
	const store = getContext<CoreFunctionState>(CORE_FUNCTION_STATE_KEY);
	if (!store) {
		throw new Error('Core Function store not found in context');
	}
	return store;
}

export function setCoreFunctionStore(initialData?: Tables<'core_function'>[]): CoreFunctionState {
	const store = createCoreFunctionStore(initialData);
	setContext(CORE_FUNCTION_STATE_KEY, store);
	return store;
}

export type { CoreFunctionState };

```

# [ipcrid]/(components)/(data)/(state)/subcorefunctionstate.svelte.ts

```ts
import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const SUB_CORE_FUNCTION_STATE_KEY = Symbol('SUB_CORE_FUNCTION_STATE_KEY');

type SubCoreFunctionState = {
	currentSubCoreFunctions: Writable<Tables<'sub_core_function'>[]>;
	addSubCoreFunction: (subCoreFunction: Tables<'sub_core_function'>) => void;
	updateSubCoreFunction: (id: string, updates: Partial<Tables<'sub_core_function'>>) => void;
	removeSubCoreFunction: (id: string) => void;
};

function createSubCoreFunctionStore(
	initialData?: Tables<'sub_core_function'>[]
): SubCoreFunctionState {
	const currentSubCoreFunctions = writable<Tables<'sub_core_function'>[]>(initialData || []);

	function addSubCoreFunction(subCoreFunction: Tables<'sub_core_function'>) {
		currentSubCoreFunctions.update((functions) => [...functions, subCoreFunction]);
	}

	function updateSubCoreFunction(id: string, updates: Partial<Tables<'sub_core_function'>>) {
		currentSubCoreFunctions.update((functions) =>
			functions.map((func) => (func.id === id ? { ...func, ...updates } : func))
		);
	}

	function removeSubCoreFunction(id: string) {
		currentSubCoreFunctions.update((functions) => functions.filter((func) => func.id !== id));
	}

	return {
		currentSubCoreFunctions,
		addSubCoreFunction,
		updateSubCoreFunction,
		removeSubCoreFunction
	};
}

export function getSubCoreFunctionStore(): SubCoreFunctionState {
	const store = getContext<SubCoreFunctionState>(SUB_CORE_FUNCTION_STATE_KEY);
	if (!store) {
		throw new Error('Sub Core Function store not found in context');
	}
	return store;
}

export function setSubCoreFunctionStore(
	initialData?: Tables<'sub_core_function'>[]
): SubCoreFunctionState {
	const store = createSubCoreFunctionStore(initialData);
	setContext(SUB_CORE_FUNCTION_STATE_KEY, store);
	return store;
}

export type { SubCoreFunctionState };

```

# [ipcrid]/(components)/(data)/types.d.ts

```ts
export type CoreFunctionFormResult = {
	form: any;
	core_function: Tables<'core_function'>;
};

```

# [ipcrid]/+layout.server.ts

```ts
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import {
	createCoreFunctionSchema,
	deleteCoreFunctionSchema,
	updateCoreFunctionSchema
} from './(components)/(data)/(schema)/core_function_schema';
import { zod } from 'sveltekit-superforms/adapters';
import {
	createSubCoreFunctionSchema,
	deleteSubCoreFunctionSchema,
	updateSubCoreFunctionSchema
} from './(components)/(data)/(schema)/sub_core_function_schema';

export const load = (async ({ params, locals: { supabase, safeGetSession } }) => {
	const ipcrId = params.ipcrid;
	if (!ipcrId) {
		error(404, {
			message: 'IPCR id is missing'
		});
	}
	//core function forms
	const createCoreFunctionForm = await superValidate(zod(createCoreFunctionSchema));
	const deleteCoreFunctionForm = await superValidate(zod(deleteCoreFunctionSchema));
	const updateCoreFunctionForm = await superValidate(zod(updateCoreFunctionSchema));
	//sub core function forms
	const createSubCoreFunctionForm = await superValidate(zod(createSubCoreFunctionSchema));
	const deleteSubCoreFunctionForm = await superValidate(zod(deleteSubCoreFunctionSchema));
	const updateSubCoreFunctionForm = await superValidate(zod(updateSubCoreFunctionSchema));
	// core function fetch
	const { data: coreFunctions, error: coreFunctionError } = await supabase
		.from('core_function')
		.select()
		.eq('ipcr_teaching_id', ipcrId)
		.order('position');
	if (coreFunctionError) {
		error(500, { message: 'Something went wrong, please contact the developer' });
	}
	return {
		ipcrId,
		data: { coreFunctions },
		coreForms: { createCoreFunctionForm, deleteCoreFunctionForm, updateCoreFunctionForm },
		subCoreForms: {
			createSubCoreFunctionForm,
			deleteSubCoreFunctionForm,
			updateSubCoreFunctionForm
		}
	};
}) satisfies LayoutServerLoad;

```

# [ipcrid]/+layout.svelte

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { setCoreFunctionStore } from './(components)/(data)/(state)/corefunctionstate.svelte';
	import { setCoreFunctionFormContext } from './(components)/(data)/(forms)/core_function_form.svelte';
	import { setSubCoreFunctionFormContext } from './(components)/(data)/(forms)/sub_core_function_form.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const { ipcrId } = data;
	const { coreFunctions } = data.data;
	const { createCoreFunctionForm, deleteCoreFunctionForm, updateCoreFunctionForm } = data.coreForms;
	const { createSubCoreFunctionForm, deleteSubCoreFunctionForm, updateSubCoreFunctionForm } =
		data.subCoreForms;
	setCoreFunctionStore(coreFunctions);
	setCoreFunctionFormContext({
		updateCoreFunctionForm,
		createCoreFunctionForm,
		deleteCoreFunctionForm
	});
	setSubCoreFunctionFormContext({
		updateSubCoreFunctionForm,
		createSubCoreFunctionForm,
		deleteSubCoreFunctionForm
	});
</script>

{@render children()}

```

# [ipcrid]/+page.server.ts

```ts
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate, type Infer } from 'sveltekit-superforms';
import {
	createCoreFunctionSchema,
	deleteCoreFunctionSchema,
	updateCoreFunctionSchema,
	type CreateCoreFunctionSchema,
	type DeleteCoreFunctionSchema,
	type UpdateCoreFunctionSchema
} from './(components)/(data)/(schema)/core_function_schema';
import { zod } from 'sveltekit-superforms/adapters';
import { titleCase } from 'title-case';

export const actions = {
	createcorefunction: async ({ request, locals: { supabase, session } }) => {
		const form = await superValidate<Infer<CreateCoreFunctionSchema>, App.Superforms.Message>(
			request,
			zod(createCoreFunctionSchema)
		);

		if (!form.valid) {
			return message(form, {
				status: 'error',
				text: 'Unprocessable input!'
			});
		}

		let { name, ipcr_teaching_id, unit, reviewer_id, position } = form.data;
		name = titleCase(name.toLocaleLowerCase());

		const { data: coreFunction, error: coreFunctionError } = await supabase
			.from('core_function')
			.insert({ name, ipcr_teaching_id, unit, reviewer_id, position })
			.select()
			.single();
		if (coreFunctionError) {
			return message(form, {
				status: 'error',
				text: `Error saving core function, ${coreFunctionError.message}`
			});
		}
		return { form, coreFunction };
	},
	deletecorefunction: async ({ request, locals: { supabase, session } }) => {
		const form = await superValidate<Infer<DeleteCoreFunctionSchema>, App.Superforms.Message>(
			request,
			zod(deleteCoreFunctionSchema)
		);
		const { id } = form.data;

		if (!form.valid) {
			return message(form, {
				status: 'error',
				text: 'Unprocessable input!'
			});
		}

		const { error: deleteError, data: coreFunction } = await supabase
			.from('core_function')
			.delete()
			.eq('id', id)
			.select()
			.single();

		if (deleteError) {
			return message(form, {
				status: 'error',
				text: `Error saving IPCR ${deleteError.message}`
			});
		}
		return { form, coreFunction };
	},
	updatecorefunction: async ({ request, locals: { supabase, session } }) => {
		const form = await superValidate<Infer<UpdateCoreFunctionSchema>, App.Superforms.Message>(
			request,
			zod(updateCoreFunctionSchema)
		);

		if (!form.valid) {
			return message(form, {
				status: 'error',
				text: 'Unprocessable input!'
			});
		}
		let { id, name, reviewer_id, unit } = form.data;
		if (name) {
			name = titleCase(name.toLocaleLowerCase());
		}
		const { data: coreFunction, error: updateError } = await supabase
			.from('core_function')
			.update({ name, reviewer_id, unit })
			.eq('id', id)
			.select()
			.single();
		if (updateError) {
			return message(form, {
				status: 'error',
				text: `Error saving IPCR ${updateError.message}`
			});
		}
		return { form, coreFunction };
	}
} satisfies Actions;

```

# [ipcrid]/+page.svelte

```svelte
<script lang="ts">
	import CoreFunction from './(components)/(body)/(core_function)/CoreFunction.svelte';
	let { data } = $props();
</script>

<CoreFunction currentIpcrId={data.ipcrId} />

```

# database.types.ts

```ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      core_function: {
        Row: {
          created_at: string
          id: string
          ipcr_teaching_id: string
          name: string
          position: number
          reviewer_id: string | null
          unit: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ipcr_teaching_id: string
          name: string
          position: number
          reviewer_id?: string | null
          unit?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ipcr_teaching_id?: string
          name?: string
          position?: number
          reviewer_id?: string | null
          unit?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "core_function_ipcr_teaching_id_fkey"
            columns: ["ipcr_teaching_id"]
            isOneToOne: false
            referencedRelation: "ipcr_teaching"
            referencedColumns: ["id"]
          },
        ]
      }
      core_function_indicator: {
        Row: {
          accomplishment: string | null
          accomplishment_date: string | null
          average_rating: number | null
          core_function_id: string | null
          created_at: string
          efficiency_rating: number | null
          id: string
          index: number
          indicator: string
          indicator_date: string | null
          quality_rating: number | null
          timeliness_rating: number | null
          updated_at: string
        }
        Insert: {
          accomplishment?: string | null
          accomplishment_date?: string | null
          average_rating?: number | null
          core_function_id?: string | null
          created_at?: string
          efficiency_rating?: number | null
          id?: string
          index: number
          indicator: string
          indicator_date?: string | null
          quality_rating?: number | null
          timeliness_rating?: number | null
          updated_at?: string
        }
        Update: {
          accomplishment?: string | null
          accomplishment_date?: string | null
          average_rating?: number | null
          core_function_id?: string | null
          created_at?: string
          efficiency_rating?: number | null
          id?: string
          index?: number
          indicator?: string
          indicator_date?: string | null
          quality_rating?: number | null
          timeliness_rating?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "core_function_indicator_core_function_id_fkey"
            columns: ["core_function_id"]
            isOneToOne: false
            referencedRelation: "core_function"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_status: {
        Row: {
          created_at: string
          id: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      ipcr_teaching: {
        Row: {
          created_at: string
          id: string
          office_id: number | null
          owner_id: string | null
          program_id: number | null
          status: Database["public"]["Enums"]["ipcr_status"]
          title: string
          unit_id: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          office_id?: number | null
          owner_id?: string | null
          program_id?: number | null
          status?: Database["public"]["Enums"]["ipcr_status"]
          title: string
          unit_id?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          office_id?: number | null
          owner_id?: string | null
          program_id?: number | null
          status?: Database["public"]["Enums"]["ipcr_status"]
          title?: string
          unit_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ipcr_teaching_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipcr_teaching_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipcr_teaching_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      nature_of_work: {
        Row: {
          created_at: string
          id: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      office: {
        Row: {
          code: string
          created_at: string
          id: number
          name: string
          unit_id: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          name: string
          unit_id: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          name?: string
          unit_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "office_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      position: {
        Row: {
          created_at: string
          id: number
          name: string
          nature_of_work_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          nature_of_work_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          nature_of_work_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "position_nature_of_work_id_fkey"
            columns: ["nature_of_work_id"]
            isOneToOne: false
            referencedRelation: "nature_of_work"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          employee_id: string | null
          employee_status_id: number | null
          first_name: string | null
          id: string
          last_name: string | null
          middle_name: string | null
          nature_of_work_id: number | null
          office_id: number | null
          position_id: number | null
          program_id: number | null
          unit_id: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          employee_id?: string | null
          employee_status_id?: number | null
          first_name?: string | null
          id: string
          last_name?: string | null
          middle_name?: string | null
          nature_of_work_id?: number | null
          office_id?: number | null
          position_id?: number | null
          program_id?: number | null
          unit_id?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          employee_id?: string | null
          employee_status_id?: number | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          middle_name?: string | null
          nature_of_work_id?: number | null
          office_id?: number | null
          position_id?: number | null
          program_id?: number | null
          unit_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_employee_status_id_fkey"
            columns: ["employee_status_id"]
            isOneToOne: false
            referencedRelation: "employee_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_nature_of_work_id_fkey"
            columns: ["nature_of_work_id"]
            isOneToOne: false
            referencedRelation: "nature_of_work"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "position"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      program: {
        Row: {
          created_at: string
          id: number
          name: string
          office_id: number
          unit_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          office_id: number
          unit_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          office_id?: number
          unit_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          id: number
          permission_id: number | null
          role_id: number | null
          scope: Database["public"]["Enums"]["scope_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          permission_id?: number | null
          role_id?: number | null
          scope?: Database["public"]["Enums"]["scope_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          permission_id?: number | null
          role_id?: number | null
          scope?: Database["public"]["Enums"]["scope_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_role_view"
            referencedColumns: ["role_id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      sub_core_function: {
        Row: {
          core_function_id: string
          created_at: string
          id: string
          name: string
          position: number
          updated_at: string
        }
        Insert: {
          core_function_id: string
          created_at?: string
          id?: string
          name: string
          position: number
          updated_at?: string
        }
        Update: {
          core_function_id?: string
          created_at?: string
          id?: string
          name?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_core_function_core_function_id_fkey"
            columns: ["core_function_id"]
            isOneToOne: false
            referencedRelation: "core_function"
            referencedColumns: ["id"]
          },
        ]
      }
      unit: {
        Row: {
          code: string
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: number
          role_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          role_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          role_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_role_view"
            referencedColumns: ["role_id"]
          },
        ]
      }
    }
    Views: {
      user_role_view: {
        Row: {
          role_id: number | null
          role_name: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_permission: {
        Args: {
          required_permission: string
          target_office_id?: number
          target_unit_id?: number
          target_program_id?: number
        }
        Returns: boolean
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: {
          role_name: string
          role_id: number
        }[]
      }
      is_system_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      ipcr_status: "draft" | "submitted" | "reviewing" | "approved"
      scope_type: "all" | "office" | "program" | "unit"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never


```

# migrations/20241116152556_create_table_unit.sql

```sql
-- Create the function for updating timestamps
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the unit table
CREATE TABLE unit (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on commonly searched columns
CREATE INDEX idx_unit_code ON unit(code);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON unit
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();


```

# migrations/20241116153626_create_table_nature_of_work.sql

```sql
-- create table
CREATE TABLE nature_of_work (
   id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
   type VARCHAR(100) NOT NULL UNIQUE,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON nature_of_work
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

```

# migrations/20241116155829_create_table_office.sql

```sql
CREATE TABLE office (
   id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
   unit_id INTEGER NOT NULL REFERENCES unit(id),
   code VARCHAR(50) NOT NULL UNIQUE,
   name VARCHAR(200) NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for foreign key
CREATE INDEX idx_office_unit_id ON office(unit_id);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON office
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

```

# migrations/20241116160732_create_table_program.sql

```sql
CREATE TABLE program (
   id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
   unit_id INTEGER NOT NULL REFERENCES unit(id),
   office_id INTEGER NOT NULL REFERENCES office(id),
   name TEXT NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for foreign keys
CREATE INDEX idx_program_unit_id ON program(unit_id);
CREATE INDEX idx_program_office_id ON program(office_id);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON program
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

```

# migrations/20241116161506_create_table_position.sql

```sql
CREATE TABLE position (
   id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
   nature_of_work_id INTEGER NOT NULL REFERENCES nature_of_work(id),
   name VARCHAR(100) NOT NULL UNIQUE,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for foreign key
CREATE INDEX idx_position_nature_of_work_id ON position(nature_of_work_id);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON position
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

```

# migrations/20241116161733_create_table_employee_status.sql

```sql
-- create table
CREATE TABLE employee_status (
   id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
   type VARCHAR(100) NOT NULL UNIQUE,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON employee_status
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();

```

# migrations/20241116162523_create_table_profile.sql

```sql
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  employee_id varchar(50) unique,
  email varchar(255) unique,
  first_name text,
  middle_name text,
  last_name text,
  avatar_url text,
  unit_id integer references unit(id),
  nature_of_work_id integer references nature_of_work(id),
  office_id integer references office(id),
  program_id integer references program(id),
  position_id integer references position(id),
  employee_status_id integer references employee_status(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Set up Row Level Security (RLS)
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- Create function to handle new user signup with Google OAuth data
create function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    avatar_url
  )
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'first_name',
      new.raw_user_meta_data->>'given_name',
      split_part(new.raw_user_meta_data->>'full_name', ' ', 1),
      'Anonymous'
    ),
    coalesce(
      new.raw_user_meta_data->>'last_name',
      new.raw_user_meta_data->>'family_name',
      array_to_string(
        array_remove(
          string_to_array(new.raw_user_meta_data->>'full_name', ' '),
          split_part(new.raw_user_meta_data->>'full_name', ' ', 1)
        ),
        ' '
      ),
      'User'
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      new.raw_user_meta_data->>'avatar',
      null
    )
  );
  return new;
exception
  when others then
    raise log 'Error in handle_new_user: %', SQLERRM;
    return new;  -- Still return the user even if profile creation fails
end;
$$;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars',true);

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

-- Allow users to upload their own avatar
create policy "Users can update their own avatar" on storage.objects
  for update to authenticated using (
    bucket_id = 'avatars' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();
```

# migrations/20241122141115_add_cascade_on_delete.sql

```sql
-- First, drop existing foreign key constraints
ALTER TABLE office DROP CONSTRAINT office_unit_id_fkey;

ALTER TABLE program DROP CONSTRAINT program_unit_id_fkey;
ALTER TABLE program DROP CONSTRAINT program_office_id_fkey;

ALTER TABLE position DROP CONSTRAINT position_nature_of_work_id_fkey;

-- Then add them back with ON DELETE CASCADE
ALTER TABLE office 
    ADD CONSTRAINT office_unit_id_fkey 
    FOREIGN KEY (unit_id) 
    REFERENCES unit(id) 
    ON DELETE CASCADE;

ALTER TABLE program 
    ADD CONSTRAINT program_unit_id_fkey 
    FOREIGN KEY (unit_id) 
    REFERENCES unit(id) 
    ON DELETE CASCADE;

ALTER TABLE program 
    ADD CONSTRAINT program_office_id_fkey 
    FOREIGN KEY (office_id) 
    REFERENCES office(id) 
    ON DELETE CASCADE;

ALTER TABLE position 
    ADD CONSTRAINT position_nature_of_work_id_fkey 
    FOREIGN KEY (nature_of_work_id) 
    REFERENCES nature_of_work(id) 
    ON DELETE CASCADE;
```

# migrations/20241122170218_add_realtime_tables.sql

```sql
alter publication supabase_realtime 
add table unit,
           nature_of_work,
           office,
           program, 
           position,
           employee_status,
           profiles;
```

# migrations/20241127102744_scope_type.sql

```sql
-- Create scope type
CREATE TYPE scope_type AS ENUM ('all', 'office','program', 'unit');
```

# migrations/20241127115411_create_roles_table.sql

```sql
-- Roles table
CREATE TABLE roles (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

# migrations/20241127120413_create_permissions_table.sql

```sql
-- Permissions table 
CREATE TABLE permissions (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

# migrations/20241127121741_create_role_permissions_table.sql

```sql
-- Role permissions mapping with scope
CREATE TABLE role_permissions (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    scope scope_type NOT NULL DEFAULT 'unit',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(role_id, permission_id)
);
```

# migrations/20241127121931_create_user_roles_table.sql

```sql
-- User roles mapping (one role per user)
CREATE TABLE user_roles (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);
```

# migrations/20241127123124_create_auth_jwt_function.sql

```sql
-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres, authenticated, anon;
GRANT SELECT ON TABLE user_roles TO supabase_auth_admin;
GRANT SELECT ON TABLE roles TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION auth.jwt() TO postgres, authenticated, anon;

-- Create the JWT function
CREATE OR REPLACE FUNCTION auth.jwt()
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER 
SET search_path = auth, public
AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'role', roles.name,
        'role_id', roles.id
    )
    INTO result
    FROM user_roles
    JOIN roles ON user_roles.role_id = roles.id
    WHERE user_roles.user_id = auth.uid();
    
    RETURN COALESCE(result, '{}'::jsonb);
END;
$$;
```

# migrations/20241127123317_create_permission_check_function.sql

```sql
CREATE OR REPLACE FUNCTION check_permission(
    required_permission VARCHAR,
    target_office_id INTEGER DEFAULT NULL,
    target_unit_id INTEGER DEFAULT NULL,
    target_program_id INTEGER DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    user_permission_scope scope_type;
    user_assigned_office_id INTEGER;
    user_assigned_unit_id INTEGER;
    user_assigned_program_id INTEGER;
    permission_exists BOOLEAN;
BEGIN
    -- Get user's scope and IDs
    SELECT 
        role_permission.scope,
        profile.office_id,
        profile.unit_id,
        profile.program_id,
        EXISTS (
            SELECT 1 
            FROM role_permissions role_permission_check
            JOIN permissions permission ON permission.id = role_permission_check.permission_id
            WHERE role_permission_check.role_id = (auth.jwt()->>'role_id')::integer 
            AND permission.name = required_permission
        )
    INTO 
        user_permission_scope,
        user_assigned_office_id,
        user_assigned_unit_id,
        user_assigned_program_id,
        permission_exists
    FROM profiles profile
    JOIN user_roles user_role ON profile.id = user_role.user_id
    JOIN role_permissions role_permission ON user_role.role_id = role_permission.role_id
    JOIN permissions permission ON role_permission.permission_id = permission.id
    WHERE profile.id = auth.uid()
    AND permission.name = required_permission;

    -- No permission found
    IF NOT permission_exists THEN
        RETURN FALSE;
    END IF;

    -- Check scope access from highest (all) to lowest (unit)
    RETURN CASE
        -- All level (highest scope)
        WHEN user_permission_scope = 'all' THEN 
            TRUE
            
        -- Program level
        WHEN user_permission_scope = 'program' THEN 
            target_program_id IS NULL OR target_program_id = user_assigned_program_id
            
        -- Office level
        WHEN user_permission_scope = 'office' THEN 
            target_office_id IS NULL OR target_office_id = user_assigned_office_id
            
        -- Unit level (lowest scope)
        WHEN user_permission_scope = 'unit' THEN 
            target_unit_id IS NULL OR target_unit_id = user_assigned_unit_id
            
        -- Default case
        ELSE 
            FALSE
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

# migrations/20241127152010_create_user_role_view.sql

```sql
CREATE VIEW user_role_view AS
SELECT 
    user_roles.user_id,
    roles.name as role_name,
    roles.id as role_id
FROM user_roles
JOIN roles ON user_roles.role_id = roles.id;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TABLE (
    role_name VARCHAR,
    role_id INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        roles.name,
        roles.id
    FROM user_roles
    JOIN roles ON user_roles.role_id = roles.id
    WHERE user_roles.user_id = auth.uid();
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_user_role() TO authenticated;
```

# migrations/20241128090943_system_admin_create_insert_function.sql

```sql
-- Create function to check if user is system admin
CREATE OR REPLACE FUNCTION is_system_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role_name VARCHAR;
BEGIN
    -- Get the role name from the JWT
    SELECT (auth.jwt()->>'role')::VARCHAR INTO user_role_name;
    
    -- Check if user has system_admin role
    RETURN user_role_name = 'system_admin';
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION is_system_admin() TO authenticated;
```

# migrations/20241128091037_RLS_for_unit.sql

```sql
-- Apply RLS policies to each table
ALTER TABLE unit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users on unit" ON unit
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable insert for system admin on unit" ON unit
    FOR INSERT TO authenticated
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable update for system admin on unit" ON unit
    FOR UPDATE TO authenticated
    USING (is_system_admin())
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable delete for system admin on unit" ON unit
    FOR DELETE TO authenticated
    USING (is_system_admin());
```

# migrations/20241128091124_RLS_for_office.sql

```sql
ALTER TABLE office ENABLE ROW LEVEL SECURITY;

-- Create policies for office table
CREATE POLICY "Enable read access for all users on office" ON office
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable insert for system admin on office" ON office
    FOR INSERT TO authenticated
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable update for system admin on office" ON office
    FOR UPDATE TO authenticated
    USING (is_system_admin())
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable delete for system admin on office" ON office
    FOR DELETE TO authenticated
    USING (is_system_admin());
```

# migrations/20241128091158_RLS_for_program.sql

```sql
ALTER TABLE program ENABLE ROW LEVEL SECURITY;

-- Create policies for program table
CREATE POLICY "Enable read access for all users on program" ON program
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable insert for system admin on program" ON program
    FOR INSERT TO authenticated
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable update for system admin on program" ON program
    FOR UPDATE TO authenticated
    USING (is_system_admin())
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable delete for system admin on program" ON program
    FOR DELETE TO authenticated
    USING (is_system_admin());
```

# migrations/20241128091248_RLS_for_nature_of_work.sql

```sql
ALTER TABLE nature_of_work ENABLE ROW LEVEL SECURITY;

-- Create policies for nature_of_work table
CREATE POLICY "Enable read access for all users on nature_of_work" ON nature_of_work
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable insert for system admin on nature_of_work" ON nature_of_work
    FOR INSERT TO authenticated
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable update for system admin on nature_of_work" ON nature_of_work
    FOR UPDATE TO authenticated
    USING (is_system_admin())
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable delete for system admin on nature_of_work" ON nature_of_work
    FOR DELETE TO authenticated
    USING (is_system_admin());
```

# migrations/20241128091505_RLS_for_position.sql

```sql
ALTER TABLE position ENABLE ROW LEVEL SECURITY;

-- Create policies for position table
CREATE POLICY "Enable read access for all users on position" ON position
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable insert for system admin on position" ON position
    FOR INSERT TO authenticated
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable update for system admin on position" ON position
    FOR UPDATE TO authenticated
    USING (is_system_admin())
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable delete for system admin on position" ON position
    FOR DELETE TO authenticated
    USING (is_system_admin());
```

# migrations/20241128091542_RLS_for_employee_status.sql

```sql
ALTER TABLE employee_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users on employee_status" ON employee_status
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Enable insert for system admin on employee_status" ON employee_status
    FOR INSERT TO authenticated
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable update for system admin on employee_status" ON employee_status
    FOR UPDATE TO authenticated
    USING (is_system_admin())
    WITH CHECK (is_system_admin());

CREATE POLICY "Enable delete for system admin on employee_status" ON employee_status
    FOR DELETE TO authenticated
    USING (is_system_admin());
```

# migrations/20241204145404_create_ipcr_teaching_table.sql

```sql
-- Create status enum type
CREATE TYPE ipcr_status AS ENUM ('draft', 'submitted', 'reviewing', 'approved');

-- Create ipcr_teaching table with status
CREATE TABLE ipcr_teaching (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    status ipcr_status DEFAULT 'draft' NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    unit_id INTEGER REFERENCES unit(id) ON DELETE CASCADE,
    office_id INTEGER REFERENCES office(id) ON DELETE CASCADE,
    program_id INTEGER REFERENCES program(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON ipcr_teaching
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();
```

# migrations/20241204145806_create_core_function_table.sql

```sql
-- Create core_function table
CREATE TABLE core_function (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   name TEXT NOT NULL,
   ipcr_teaching_id UUID REFERENCES ipcr_teaching(id) ON DELETE CASCADE NOT NULL,
   unit NUMERIC(4,2),
   reviewer_id UUID REFERENCES auth.users(id),
   position SMALLINT NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add index for better query performance when ordering by position
CREATE INDEX idx_core_function_position ON core_function(position, ipcr_teaching_id);

-- Trigger for updating the updated_at timestamp
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON core_function
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();
```

# migrations/20241204145908_create_sub_core_function_table.sql

```sql
CREATE TABLE sub_core_function (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   core_function_id UUID REFERENCES core_function(id) ON DELETE CASCADE NOT NULL,
   name TEXT NOT NULL,
   position INTEGER NOT NULL,  -- Added position column with default value
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add an index on position and core_function_id for better performance when sorting
CREATE INDEX idx_sub_core_function_position ON sub_core_function(core_function_id, position);

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON sub_core_function
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();
```

# migrations/20241204150054_create_core_function_indicator_table.sql

```sql
CREATE TABLE core_function_indicator (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   indicator TEXT NOT NULL,
   accomplishment TEXT,
   indicator_date DATE,
   accomplishment_date DATE,
   quality_rating NUMERIC(3,2),
   efficiency_rating NUMERIC(3,2),
   timeliness_rating NUMERIC(3,2),
   average_rating NUMERIC(3,2),
   core_function_id UUID REFERENCES core_function(id) ON DELETE CASCADE,
   index INTEGER NOT NULL,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON core_function_indicator
    FOR EACH ROW
    EXECUTE FUNCTION fn_set_updated_at();
```

# package.json

```json
{
	"name": "frontend",
	"version": "0.0.1",
	"type": "module",
	"scripts": {
		"dev": "vite dev",
		"build": "vite build",
		"preview": "vite preview",
		"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
		"check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
		"format": "prettier --write .",
		"lint": "prettier --check . && eslint ."
	},
	"devDependencies": {
		"@sveltejs/adapter-auto": "^3.0.0",
		"@sveltejs/enhanced-img": "^0.4.1",
		"@sveltejs/kit": "^2.0.0",
		"@sveltejs/vite-plugin-svelte": "^4.0.0",
		"@tailwindcss/aspect-ratio": "^0.4.2",
		"@tailwindcss/container-queries": "^0.1.1",
		"@tailwindcss/forms": "^0.5.9",
		"@tailwindcss/typography": "^0.5.15",
		"@types/eslint": "^9.6.0",
		"autoprefixer": "^10.4.20",
		"bits-ui": "^1.0.0-next.64",
		"clsx": "^2.1.1",
		"embla-carousel-svelte": "^8.3.1",
		"eslint": "^9.7.0",
		"eslint-config-prettier": "^9.1.0",
		"eslint-plugin-svelte": "^2.36.0",
		"formsnap": "^2.0.0-next.1",
		"globals": "^15.0.0",
		"lucide-svelte": "^0.460.1",
		"mode-watcher": "^0.4.1",
		"prettier": "^3.3.2",
		"prettier-plugin-svelte": "^3.2.6",
		"prettier-plugin-tailwindcss": "^0.6.5",
		"svelte": "^5.0.0",
		"svelte-check": "^4.0.0",
		"svelte-radix": "^2.0.1",
		"svelte-sonner": "^0.3.28",
		"sveltekit-superforms": "^2.20.0",
		"tailwind-merge": "^2.5.4",
		"tailwind-variants": "^0.2.1",
		"tailwindcss": "^3.4.9",
		"tailwindcss-animate": "^1.0.7",
		"typescript": "^5.0.0",
		"typescript-eslint": "^8.0.0",
		"vite": "^5.0.3",
		"zod": "^3.23.8"
	},
	"dependencies": {
		"@supabase/ssr": "^0.5.1",
		"@supabase/supabase-js": "^2.46.1",
		"@tanstack/table-core": "^8.20.5",
		"date-fns": "^4.1.0",
		"debounce": "^2.2.0",
		"embla-carousel-autoplay": "^8.3.1",
		"svelte-dnd-action": "^0.9.52",
		"title-case": "^4.3.2"
	}
}

```

