<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { LoaderCircle, Save } from 'lucide-svelte';
	import { Plus } from 'lucide-svelte';
	import { setError, superForm, type FormResult } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { getOperationalPlanStore } from '../../../states/current_operational_plan_state';
	import { getOpHeaderStore } from '../../../states/op_header_state';
	import { getOpHeaderFormContext } from '../../../states/op_header_form_state';
	import { createOpHeaderSchema } from '../../../schema/op_header_schema';
	import type { OpHeaderFormResult } from '../../../utils/type';
	import AutoCompleteOfflineInput from '$lib/custom_components/AutoCompleteOfflineInput.svelte';

	//stores
	const { currentOperationalPlan } = getOperationalPlanStore();
	const { currentOpHeaders } = getOpHeaderStore();
	const { createForm } = getOpHeaderFormContext();
	const { size, addOpHeader } = getOpHeaderStore();

	//states
	let isOpen = $state(false);

	//form
	const form = superForm(createForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(createOpHeaderSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			if (
				$currentOpHeaders.some(
					(opHeader) => opHeader.title.toLowerCase() === form.data.title.toLowerCase()
				)
			) {
				setError(form, 'title', 'Title already exists');
			}
			const action = result.data as FormResult<OpHeaderFormResult>;
			if (form.valid && action.opHeader) {
				const opHeader = action.opHeader;
				addOpHeader(opHeader);
				showSuccessToast(`Succesfully added operational header ${opHeader.title}`);
				isOpen = false;
				reset({
					data: { operational_plan_id: opHeader.operational_plan_id, position: $size + 1 },
					newState: { operational_plan_id: opHeader.operational_plan_id, position: $size + 1 }
				});
			}
		}
	});

	const { form: formData, enhance, delayed, message, reset } = form;
	//set data that is needed
	if ($currentOperationalPlan) {
		$formData.operational_plan_id = $currentOperationalPlan.id;
		$formData.position = $size + 1;
	}

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error adding operational header: ${$message.text}`);
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
	<Dialog.Trigger class="focus-visible:outline-none" id="nav-2">
		<span class="flex items-center gap-2">
			<Plus class="h-5 w-5" />
			<span class="hidden md:inline">Add Header</span>
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[800px]">
		<Dialog.Header>
			<Dialog.Title>Add operational header</Dialog.Title>
			<Dialog.Description>
				Operational headers are Key areas supporting institutional growth, including instruction,
				research, community management, faculty development, infrastructure, international linkages,
				and administration.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createopheader" method="POST" use:enhance class="space-y-6">
			<input hidden name="position" value={$formData.position} />
			<input hidden name="operational_plan_id" value={$formData.operational_plan_id} />
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
