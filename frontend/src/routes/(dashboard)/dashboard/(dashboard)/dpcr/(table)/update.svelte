<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { GripHorizontal, Pencil, Plus, Save, Trash2 } from 'lucide-svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import SuperDebug, {
		type SuperValidated,
		type Infer,
		superForm,
		type FormResult
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { checkProfileCompletion } from '$lib/utils/missingDetailsToast';
	import type { DPCRFormResult } from '../(data)/types';
	import Button from '$lib/components/ui/button/button.svelte';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import { updateDpcrSchema, type UpdateDpcrInput } from '../(data)/dpcr_schema';
	import { getDpcrStore } from '../(data)/dpcr_state';
	import type { Tables } from '$lib/types/database.types';
	import { onMount } from 'svelte';
	import { fetchAssessors } from '../(data)/helper';
	import { browser } from '$app/environment';

	let {
		updateForm,
		id,
		dropDownOpen = $bindable()
	}: {
		updateForm: SuperValidated<UpdateDpcrInput>;
		id: string;
		dropDownOpen?: boolean;
	} = $props();

	//Stores
	const { currentDpcrs, updateDpcr } = getDpcrStore();

	//state
	let isOpen = $state(false);
	let assessors: Tables<'dpcr_assessor'>[] = $state([]);

	//onmount
	onMount(async () => {
		assessors = await fetchAssessors(id);
	});

	//variables
	const flipDurationMs = 300;
	const form = superForm(updateForm, {
		validators: zodClient(updateDpcrSchema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<DPCRFormResult>;
			if (form.valid && action.dpcr) {
				const dpcr = action.dpcr;
				updateDpcr(dpcr.id, dpcr);
				console.log(dpcr.title);
				showSuccessToast(`Succesfully updated DPCR ${dpcr.title}`);
				isOpen = false;
				dropDownOpen = false;
			}
		}
	});

	const { form: formData, enhance, message, delayed, reset, errors } = form;

	$effect(() => {
		if ($message?.status == 'success') {
			showSuccessToast($message.text);
			isOpen = false;
			reset({});
		}

		if ($message?.status == 'error') {
			showErrorToast($message.text);
			reset({});
		}
		$formData.assessors = assessors;
	});

	const currentDpcr = $currentDpcrs.find((dpcr) => dpcr.id === id);
	if (currentDpcr) {
		$formData.id = id.toString();
		$formData.title = currentDpcr.title;
		$formData.review_by = currentDpcr.review_by;
		$formData.reviewer_position = currentDpcr.reviewer_position;
	}

	//helpers
	function addAssessor() {
		const now = new Date().toISOString();
		let newAssessor = {
			id: crypto.randomUUID(),
			dpcr_id: currentDpcr!.id,
			name: '',
			position: '',
			sequence: assessors.length,
			created_at: now,
			updated_at: now
		};
		assessors.push({ ...newAssessor });
	}

	function removeAssessor(id: string) {
		assessors = assessors.filter((assessor) => assessor.id !== id);
	}

	function handleDndConsider(e: CustomEvent<DndEvent<Tables<'dpcr_assessor'>>>) {
		assessors = e.detail.items.map((item, index) => ({
			...item,
			sequence: index
		}));
	}

	function handleDndFinalize(e: CustomEvent<DndEvent<Tables<'dpcr_assessor'>>>) {
		assessors = e.detail.items.map((item, index) => ({
			...item,
			sequence: index
		}));
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class=" focus-visible:outline-none">
		<span class="flex items-center gap-3">
			<Pencil size={16} /> Edit
		</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title>Department Performance Commitment And Review (DPCR)</Dialog.Title>
			<Dialog.Description>
				An DPCR is a document that outlines the department's performance targets and commitments for
				the year. It is used to monitor the department's performance and ensure that it is aligned
				with the organization's goals.
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/updatedpcr" method="POST" use:enhance>
			<Input name="id" class="hidden" bind:value={$formData.id} />
			<Form.Field {form} name="title">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Title</Form.Label>
						<Input {...props} bind:value={$formData.title} />
					{/snippet}
				</Form.Control>
				<Form.Description
					>A descriptive name automatically inferred from the year of creation, typically reflecting
					the plan's timeframe (e.g., "DPCR 2024").</Form.Description
				>
				<Form.FieldErrors />
			</Form.Field>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Form.Field {form} name="review_by">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Reviewer's Name</Form.Label>
							<Input {...props} bind:value={$formData.review_by} placeholder="Juan De La D. Cruz" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="reviewer_position">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Reviewer's Position</Form.Label>
							<Input
								{...props}
								bind:value={$formData.reviewer_position}
								placeholder="e.g president.."
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="mb-2 flex flex-col gap-2 rounded border p-4 text-center">
				{#if assessors.length === 0}
					<p class="text-gray-500">No assessors added yet</p>
				{:else}
					<div class=" mx-8 flex gap-14">
						<h2>Assessor's Name</h2>
						<h2>Assessor's Position</h2>
					</div>
				{/if}
				<!--list the assesor and add assesor-->
				<div
					class="flex flex-col gap-4"
					use:dndzone={{
						items: assessors,
						flipDurationMs,
						dropAnimationDisabled: true,
						dropTargetStyle: { outline: `rgba(102, 204, 255, 0.7) solid 2px` }
					}}
					onconsider={handleDndConsider}
					onfinalize={handleDndFinalize}
				>
					{#each assessors as assessor (assessor.id)}
						<div class="flex items-center gap-4">
							<GripHorizontal size="16" />
							<div class="flex-1">
								<input type="hidden" bind:value={assessor.id} />
								<input type="hidden" bind:value={assessor.dpcr_id} />
								<input type="hidden" bind:value={assessor.sequence} />

								<Input type="text" bind:value={assessor.name} placeholder="Assessor Name" />
								{#if $errors.assessors?.[assessor.id]?.name}
									<p class="mt-1 text-sm text-red-500">{$errors.assessors[assessor.id].name}</p>
								{/if}
							</div>

							<div class="flex-1">
								<Input type="text" bind:value={assessor.position} placeholder="Position" />
								{#if $errors.assessors?.[assessor.id]?.position}
									<p class="mt-1 text-sm text-red-500">
										{$errors.assessors[assessor.id].position}
									</p>
								{/if}
							</div>

							<Button variant="ghost" class="w-fit" onclick={() => removeAssessor(assessor.id)}>
								<Trash2 size="16" color="#dc2626" />
							</Button>
						</div>
					{/each}
				</div>
				<Button variant="outline" class="border-dashed" onclick={addAssessor}>
					<Plus size="16" />
					Add Assessor
				</Button>
			</div>

			{#if $delayed}
				<Form.Button disabled class="w-full"
					><LoaderCircle class="animate-spin" />Processing...</Form.Button
				>
			{:else}
				<Form.Button class="w-full"><Save />Save</Form.Button>
			{/if}
		</form>
	</Dialog.Content>
</Dialog.Root>
