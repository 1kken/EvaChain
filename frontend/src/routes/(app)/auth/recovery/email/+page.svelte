<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { emailSchema } from './schema';
	import BorderBeam from '$lib/magic-ui/BorderBeam.svelte';
	import { Send, LoaderCircle, Key } from 'lucide-svelte';
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

<div
	class="relative flex w-full max-w-md items-center justify-center space-y-6 rounded-lg border p-6 shadow-lg backdrop-blur-sm"
>
	<BorderBeam size={150} duration={12} />
	<form method="POST" action="?/sendemail" use:enhance>
		<div class="text-center">
			<div class="flex items-center justify-center space-x-2">
				<Key />
				<h2 class="text-2xl font-bold">Recover Account</h2>
			</div>
			<p class="text-gray-500">Enter your email to send recovery link.</p>
		</div>
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<Input {...props} bind:value={$formData.email} placeholder="recover.me@dmmmsu.edu.ph" />
				{/snippet}
			</Form.Control>
			<Form.Description>Input email where we will send the recovery link.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button disabled={$delayed} class="w-full">
			{#if $delayed}
				<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				Sending...
			{:else}
				<Send class="mr-2 h-4 w-4" />
				Send Recovery Link
			{/if}
		</Form.Button>
	</form>
</div>
