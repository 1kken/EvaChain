<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Pencil } from 'lucide-svelte';
	import { getCoreFunctionFormContext } from '../../../../(data)/(forms)/core_function_form.svelte';
	import { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { updateCoreFunctionSchema } from '../../../../../utils/schemas/core_function_schema';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { CoreFunctionFormResult, SupportFunctionFormResult } from '../../../../(data)/types';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { getCoreFunctionStore } from '../../../../(data)/(state)/corefunctionstate.svelte';
	import { getSupportFunctionFormContext } from '../../../../(data)/(forms)/support_function_form.svelte';
	import { getSupportFunctionStore } from '../../../../(data)/(state)/support_function_state.svelte';
	import { updateSupportFunctionSchema } from '../../../../../utils/schemas/support_function_schema';

	let {
		supportFunctionId,
		isDrawerOpen = $bindable()
	}: { supportFunctionId: string; isDrawerOpen: boolean } = $props();
	let isOpen = $state(false);
	let suggestions: { id: string; display: string }[] = $state([]);
	let displayName = $state('');

	const { updateSupportFunctionForm } = getSupportFunctionFormContext();
	const { currentSupportFunctions, updateSupportFunction } = getSupportFunctionStore();
	const form = superForm(updateSupportFunctionForm, {
		dataType: 'json',
		validators: zodClient(updateSupportFunctionSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<SupportFunctionFormResult>;
			if (form.valid && action.support_function && currentSupportFunctions) {
				const supportFunction = action.support_function;
				updateSupportFunction(supportFunction.id, supportFunction);
				displayName = '';
				isOpen = false;
				isDrawerOpen = false;
				showSuccessToast(`Succesfully added core function ${supportFunction.name}`);
			}
		}
	});

	const currentSupportFunction = $currentSupportFunctions.find((c) => c.id === supportFunctionId);
	const { form: formData, enhance, delayed, message, reset } = form;
	$effect(() => {
		if (currentSupportFunction) {
			$formData.id = supportFunctionId;
			$formData.name = currentSupportFunction.name;
			$formData.unit = currentSupportFunction.unit;
			$formData.reviewer_id = currentSupportFunction.reviewer_id ?? undefined;
			if (currentSupportFunction.reviewer_id) {
				fetchReviewer(currentSupportFunction.reviewer_id);
			}
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
			<Dialog.Title>Create Support Function</Dialog.Title>
			<Dialog.Description>
				A support function is a secondary responsibility area in your role with an assigned weight
				(unit) for performance evaluation. It represents supplementary duties that assist in
				achieving organizational goals.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updatesupportfunction" method="POST" use:enhance class="space-y-6">
			<input name="id" value={$formData.id} hidden />
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Title</Form.Label>
						<Input {...props} bind:value={$formData.name} />
						<Form.Description>This is the title of the support function.</Form.Description>
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
								>A unit represents your credit allocation for each support function in your
								performance evaluation.</Form.Description
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
