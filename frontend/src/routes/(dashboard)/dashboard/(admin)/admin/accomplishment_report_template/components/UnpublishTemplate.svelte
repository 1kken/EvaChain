<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Undo, LoaderCircle } from 'lucide-svelte';
	import { getCurrentAccomplishmentReportTemplateStore } from '../states/accomplishment_report_state';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import type { FormResult, Infer } from 'sveltekit-superforms';
	import {
		templatePublishSchema,
		type TemplatePublishAction
	} from '../schema/accomplishment_template_schema';
	import type { AccomplishmentReportTemplateFormResult } from '../utils/types';

	//props
	let { publishActionForm }: { publishActionForm: SuperValidated<Infer<TemplatePublishAction>> } =
		$props();

	//states
	let isOpen = $state(false);

	//stores
	const { currentAccomplishmentReportTemplate, updateAccomplishmentReportTemplate } =
		getCurrentAccomplishmentReportTemplateStore();

	//form
	const form = superForm(publishActionForm, {
		id: crypto.randomUUID(),
		dataType: 'json',
		validators: zodClient(templatePublishSchema),
		multipleSubmits: 'prevent',
		onUpdate({ form, result }) {
			const action = result.data as FormResult<AccomplishmentReportTemplateFormResult>;
			if (form.valid && action.template) {
				updateAccomplishmentReportTemplate(action.template);
				showSuccessToast('Template unpublished successfully');
				isOpen = false;
			}
		}
	});

	const { form: formData, enhance, delayed, message } = form;

	if (!$currentAccomplishmentReportTemplate) {
		throw new Error('Template not found');
	}
	$formData.template_id = $currentAccomplishmentReportTemplate.id;

	//effect for message
	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast(`Error unpublishing template: ${$message.text}`);
		}
	});
</script>

<AlertDialog.Root bind:open={isOpen}>
	<AlertDialog.Trigger class="focus-visible:outline-none" id="nav-3">
		<span class="flex items-center gap-2">
			<Undo class="h-5 w-5" />
			<span class="hidden md:inline">Unpublish Template</span>
		</span>
	</AlertDialog.Trigger>

	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Unpublish Template</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to unpublish this template? Once unpublished, it will no longer be
				available for users to create new accomplishment reports.
			</AlertDialog.Description>
		</AlertDialog.Header>

		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={$delayed}>Cancel</AlertDialog.Cancel>

			<form action="?/unpublishaccomplishmenttemplate" method="POST" use:enhance>
				<input hidden name="template_id" value={$formData.template_id} />
				<AlertDialog.Action type="submit" disabled={$delayed} class={buttonVariants()}>
					{#if $delayed}
						<LoaderCircle class="mr-2 animate-spin" />
						Unpublishing...
					{:else}
						Unpublish
					{/if}
				</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
