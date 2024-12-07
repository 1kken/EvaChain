<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Plus } from 'lucide-svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import { getSubCoreFunctionFormContext } from '../../../../(data)/(forms)/sub_core_function_form.svelte';
	import { getSubCoreFunctionStore } from '../../../../(data)/(state)/subcorefunctionstate.svelte';
	import SuperDebug, { superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { createSubCoreFunctionSchema } from '../../../../(data)/(schema)/sub_core_function_schema';
	import type { SubCoreFunctionFormResult } from '../../../../(data)/types';
	import { showSuccessToast } from '$lib/utils/toast';
	import * as Form from '$lib/components/ui/form/index.js';
	import { browser } from '$app/environment';
	interface Props {
		coreFunctionId: string;
	}
	let { coreFunctionId }: Props = $props();
	let isOpen = $state(false);
	const { createSubCoreFunctionForm: data } = getSubCoreFunctionFormContext();
	// Get the complete store object
	const subCoreFunctionStore = getSubCoreFunctionStore();

	// Destructure specific properties
	const { currentSubCoreFunctions, size } = subCoreFunctionStore;

	const form = superForm(data!, {
		dataType: 'json',
		validators: zodClient(createSubCoreFunctionSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<SubCoreFunctionFormResult>;
			if (form.valid && action && subCoreFunctionStore) {
				const subCoreFunction = action.subCoreFunction;
				subCoreFunctionStore.addSubCoreFunction(subCoreFunction);
				showSuccessToast(`Succesfully added core function ${subCoreFunction.name}`);
				const ipcrId = $formData.core_function_id; // Save ID before reset
				isOpen = false;
				reset({
					data: { core_function_id: ipcrId, position: $size },
					newState: { core_function_id: ipcrId, position: $size }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	$effect(() => {
		if (coreFunctionId) {
			$formData.core_function_id = coreFunctionId;
			$formData.position = $size;
		}
	});
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
		<span class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			<span class="hidden md:inline">Add Sub Core Function</span>
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Create Sub Core Function</Dialog.Title>
			<Dialog.Description>
				A sub-core function is a specific task or duty within a core function, supporting the
				achievement of the primary responsibilities. It further breaks down core functions into
				actionable components for detailed performance evaluation.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createsubcorefunction" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input hidden name="index" value={$formData.core_function_id} />
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Title</Form.Label>
						<Input {...props} bind:value={$formData.name} />
						<Form.Description>This is the title of the sub core function.</Form.Description>
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
		{#if browser}
			<SuperDebug data={$formData} />
		{/if}
	</Dialog.Content>
</Dialog.Root>
