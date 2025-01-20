<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { emailSchema } from './schema';
	import BorderBeam from '$lib/magic-ui/BorderBeam.svelte';
	import { Send, LoaderCircle } from 'lucide-svelte';
	import { showSuccessToast } from '$lib/utils/toast';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(emailSchema)
	});

	const { form: formData, enhance, message, delayed } = form;

	$effect(() => {
		if ($message?.status === 'success') {
			showSuccessToast('Recovery link sent to your email');
		}
	});
</script>

<div class="relative w-full max-w-md space-y-6 rounded-lg p-6 shadow-md backdrop-blur-sm">
	<BorderBeam size={150} duration={12} />
	<form method="POST" action="?/sendemail" use:enhance>
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<Input {...props} bind:value={$formData.email} />
				{/snippet}
			</Form.Control>
			<Form.Description>Input email where we will send the recovery link.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button disabled={$delayed}>
			{#if $delayed}
				<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				Sending...
			{:else}
				<Send class="mr-2 h-4 w-4" />
				Submit
			{/if}
		</Form.Button>
	</form>
</div>
