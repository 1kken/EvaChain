<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import { getCoreFunctionFormContext } from '../../../../(data)/(forms)/core_function_form.svelte';
	import { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { createCoreFunctionSchema } from '../../../../../utils/schemas/core_function_schema';
	import { getIPCRStore } from '../../../../../../(data)/state.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { CoreFunctionFormResult } from '../../../../(data)/types';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { getCoreFunctionStore } from '../../../../(data)/(state)/corefunctionstate.svelte';

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
			if (form.valid && action.coreFunction && coreFunctionStore) {
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
		if ($message?.status === 'error') {
			showErrorToast($message.text);
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
			<input hidden name="position" value={$formData.position} />
			<input hidden name="ipcr_teaching_id" value={$formData.ipcr_teaching_id} />
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
