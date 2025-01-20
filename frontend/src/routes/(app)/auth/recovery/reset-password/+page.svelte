<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import BorderBeam from '$lib/magic-ui/BorderBeam.svelte';
	import { Send, LoaderCircle } from 'lucide-svelte';
	import { showSuccessToast } from '$lib/utils/toast';
	import { passwordRecoverySchema } from './schema';
	import { EyeOff } from 'lucide-svelte';
	import { Eye } from 'lucide-svelte';
	import { Lock } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(passwordRecoverySchema)
	});

	const { form: formData, enhance, message, delayed } = form;

	$effect(() => {
		if ($message?.status === 'success') {
			showSuccessToast('Password successfully reset. You can now login with your new password.');
		}
	});

	// Password visibility states
	let showPassword: boolean = $state(false);
	let showConfirmPassword: boolean = $state(false);
</script>

<div class="relative w-full max-w-md space-y-6 rounded-lg p-6 shadow-md backdrop-blur-sm">
	<h1>Recover Password</h1>
	<BorderBeam size={150} duration={12} />
	<form method="POST" action="?/resetpassword" use:enhance>
		<Form.Field {form} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Password</Form.Label>
					<div class="relative">
						<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
							<Lock size={18} />
						</span>
						<Input
							placeholder="••••••••"
							{...props}
							class="pl-10 pr-12"
							bind:value={$formData.password}
							type={showPassword ? 'text' : 'password'}
							required
						/>
						<button
							type="button"
							onclick={() => (showPassword = !showPassword)}
							class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
						>
							{#if showPassword}
								<EyeOff size={18} />
							{:else}
								<Eye size={18} />
							{/if}
						</button>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<!-- Confirm Password -->
		<Form.Field {form} name="passwordConfirm">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Confirm Password</Form.Label>
					<div class="relative">
						<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
							<Lock size={18} />
						</span>
						<Input
							placeholder="••••••••"
							{...props}
							class="pl-10 pr-12"
							bind:value={$formData.passwordConfirm}
							type={showPassword ? 'text' : 'password'}
							required
						/>
						<button
							type="button"
							onclick={() => (showConfirmPassword = !showConfirmPassword)}
							class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
						>
							{#if showConfirmPassword}
								<EyeOff size={18} />
							{:else}
								<Eye size={18} />
							{/if}
						</button>
					</div>
				{/snippet}
			</Form.Control>
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
