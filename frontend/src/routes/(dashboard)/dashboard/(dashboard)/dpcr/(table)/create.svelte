<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { GripHorizontal, Plus, Trash2 } from 'lucide-svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import {
		type SuperValidated,
		type Infer,
		superForm,
		type FormResult
	} from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { checkProfileCompletion } from '$lib/utils/missingDetailsToast';
	import { createDpcrSchema, type CreateDpcrSchema } from '../(data)/dpcr_schema';
	import { getAuthStore } from '$lib/utils/authStore';
	import { getDpcrStore, setDpcrStore } from '../(data)/dpcr_state';
	import type { DPCRFormResult } from '../(data)/types';
	import IncompleteProfile from './incompleteProfile.svelte';
	import { Label } from '$lib/components/ui/label';
	import Button from '$lib/components/ui/button/button.svelte';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';

	let { data }: { data: SuperValidated<Infer<CreateDpcrSchema>> } = $props();

	//Stores
	const { addDpcr } = getDpcrStore();
	const { currentProfile } = getAuthStore();
	//state
	let isOpen = $state(false);
	interface CreateAssesor {
		id: number;
		name: string;
		position: string;
		sequence: number;
	}
	let assessors: CreateAssesor[] = $state([]);
	//variables
	const flipDurationMs = 300;
	const form = superForm(data, {
		validators: zodClient(createDpcrSchema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<DPCRFormResult>;
			if (form.valid && action.dpcr) {
				const dpcr = action.dpcr;
				addDpcr(dpcr);
				showSuccessToast(`Succesfully added DPCR ${dpcr.title}`);
				isOpen = false;
			}
		}
	});

	const { form: formData, enhance, message, delayed, reset, errors } = form;
	const year = new Date().getFullYear();
	let completeProfile = $state(true);
	let errorMessage = $state<string | null>();

	$effect(() => {
		if ($currentProfile === null) return;
		const errormessage = checkProfileCompletion($currentProfile);
		if (errormessage) {
			completeProfile = false;
			errorMessage = errormessage;
		} else {
			completeProfile = true;
			errorMessage = null;
		}
		if ($message?.status == 'success') {
			showSuccessToast($message.text);
			isOpen = false;
			reset({
				data: { title: `DPCR ${year}`, assessors: [], review_by: '', reviewer_position: '' },
				newState: { title: `DPCR ${year}`, assessors: [], review_by: '', reviewer_position: '' }
			});
		}

		if ($message?.status == 'error') {
			showErrorToast($message.text);
			reset({
				data: { title: `DPCR ${year}`, assessors: [], review_by: '', reviewer_position: '' },
				newState: { title: `DPCR ${year}`, assessors: [], review_by: '', reviewer_position: '' }
			});
		}
		$formData.assessors = assessors;
	});
	$formData.title = `DPCR ${year}`;

	//helpers
	function addAssessor() {
		assessors.push({ id: assessors.length, name: '', position: '', sequence: assessors.length });
	}

	function removeAssessor(index: number) {
		assessors = assessors.filter((_, i) => i !== index);
	}

	function handleDndConsider(e: CustomEvent<DndEvent<CreateAssesor>>) {
		assessors = e.detail.items.map((item, index) => ({
			...item,
			sequence: index
		}));
	}

	function handleDndFinalize(e: CustomEvent<DndEvent<CreateAssesor>>) {
		assessors = e.detail.items.map((item, index) => ({
			...item,
			sequence: index
		}));
	}
</script>

{#if !completeProfile}
	<IncompleteProfile errors={errorMessage} />
{:else}
	<Dialog.Root bind:open={isOpen}>
		<Dialog.Trigger class={buttonVariants({ variant: 'default' })}
			><Plus /> Create DPCR</Dialog.Trigger
		>
		<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[500px]">
			<Dialog.Header>
				<Dialog.Title>Department Performance Commitment And Review (DPCR)</Dialog.Title>
				<Dialog.Description>
					An DPCR is a document that outlines the department's performance targets and commitments
					for the year. It is used to monitor the department's performance and ensure that it is
					aligned with the organization's goals.
				</Dialog.Description>
			</Dialog.Header>
			<form action="?/createdpcr" method="POST" use:enhance>
				<Form.Field {form} name="title">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Title</Form.Label>
							<Input {...props} bind:value={$formData.title} />
						{/snippet}
					</Form.Control>
					<Form.Description
						>A descriptive name automatically inferred from the year of creation, typically
						reflecting the plan's timeframe (e.g., "DPCR 2024").</Form.Description
					>
					<Form.FieldErrors />
				</Form.Field>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Form.Field {form} name="review_by">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Reviewer's Name</Form.Label>
								<Input
									{...props}
									bind:value={$formData.review_by}
									placeholder="Juan De La D. Cruz"
								/>
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
						<div class="flex gap-16">
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
					<Form.Button disabled><LoaderCircle class="animate-spin" />Processing...</Form.Button>
				{:else}
					<Form.Button>Submit</Form.Button>
				{/if}
			</form>
		</Dialog.Content>
	</Dialog.Root>
{/if}
