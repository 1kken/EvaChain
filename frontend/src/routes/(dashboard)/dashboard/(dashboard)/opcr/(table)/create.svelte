<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { GripHorizontal, Plus, Save, Trash2 } from 'lucide-svelte';
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
	import { getAuthStore } from '$lib/utils/authStore';
	import IncompleteProfile from './incompleteProfile.svelte';
	import { createOpcrSchema, type CreateOpcrSchema } from '../(data)/opcr_schema';
	import { getOpcrStore } from '../(data)/opcr_state';
	import type { OPCRFormResult } from '../(data)/types';

	let { data }: { data: SuperValidated<Infer<CreateOpcrSchema>> } = $props();

	//Stores
	const { addOpcr } = getOpcrStore();
	const { currentProfile } = getAuthStore();
	//state
	let isOpen = $state(false);
	//variables
	const flipDurationMs = 300;
	const form = superForm(data, {
		validators: zodClient(createOpcrSchema),
		multipleSubmits: 'prevent',
		dataType: 'json',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<OPCRFormResult>;
			if (form.valid && action.opcr) {
				const opcr = action.opcr;
				addOpcr(opcr);
				showSuccessToast(`Succesfully added OPCR ${opcr.title}`);
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
				data: { title: `OPCR ${year}` },
				newState: { title: `OPCR ${year}` }
			});
		}

		if ($message?.status == 'error') {
			showErrorToast($message.text);
			reset({
				data: { title: `DPCR ${year}` },
				newState: { title: `DPCR ${year}` }
			});
		}
	});
	$formData.title = `OPCR ${year}`;
</script>

{#if !completeProfile}
	<IncompleteProfile errors={errorMessage} />
{:else}
	<Dialog.Root bind:open={isOpen}>
		<Dialog.Trigger class={buttonVariants({ variant: 'default' })}
			><Plus /> Create OPCR</Dialog.Trigger
		>
		<Dialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[500px]">
			<Dialog.Header>
				<Dialog.Title>Office Performance Commitment And Review (OPCR)</Dialog.Title>
				<Dialog.Description>
					An OPCR is a document that outlines the performance targets and accomplishments of an
					office for a given period. It is a tool for performance management and accountability.
				</Dialog.Description>
			</Dialog.Header>
			<form action="?/createopcr" method="POST" use:enhance>
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
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<Form.Field {form} name="planning_officer">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Planning Officer's Name</Form.Label>
								<Input
									{...props}
									bind:value={$formData.planning_officer}
									placeholder="Juan De La D. Cruz"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="human_resource">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Human Resource's Name</Form.Label>
								<Input
									{...props}
									bind:value={$formData.human_resource}
									placeholder="Juan De La D. Cruz"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<Form.Field {form} name="administrative_officer">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Administrative Officer's Name</Form.Label>
							<Input
								{...props}
								bind:value={$formData.administrative_officer}
								placeholder="Juan De La D. Cruz"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				{#if $delayed}
					<Form.Button class="w-full" disabled
						><LoaderCircle class="animate-spin" />Processing...</Form.Button
					>
				{:else}
					<Form.Button class="w-full"><Save />Save</Form.Button>
				{/if}
			</form>
		</Dialog.Content>
	</Dialog.Root>
{/if}
