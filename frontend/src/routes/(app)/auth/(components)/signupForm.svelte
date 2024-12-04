<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { LoaderCircle, Lock } from 'lucide-svelte';
	import { Mail } from 'lucide-svelte';
	import { User } from 'lucide-svelte';
	import { EyeOff } from 'lucide-svelte';
	import { Eye } from 'lucide-svelte';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';

	import { signupSchema, type SignupSchema } from '../(data)/schema';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Checkbox } from '$lib/components/ui/checkbox';

	type Props = {
		data: SuperValidated<Infer<SignupSchema>>;
	};
	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(signupSchema)
	});

	const { form: formData, message, delayed, enhance } = form;
	$effect(() => {
		if ($message?.status === 'success') {
			showSuccessToast($message.text);
		}
		if ($message?.status === 'error') {
			showErrorToast($message.text);
		}
	});

	// Password visibility states
	let showPassword: boolean = $state(false);
	let showConfirmPassword: boolean = $state(false);
</script>

<!-- Auth Form -->
<form class="space-y-4" method="POST" action="?/signup" use:enhance>
	<!-- Name Fields -->
	<div class="grid grid-cols-2 gap-4">
		<Form.Field {form} name="firstName">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>First Name</Form.Label>
					<div class="relative">
						<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
							<User size={18} />
						</span>
						<Input {...props} placeholder="John" class="pl-10" bind:value={$formData.firstName} />
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="lastName">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Last Name</Form.Label>
					<div class="relative">
						<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
							<User size={18} />
						</span>
						<Input {...props} placeholder="Doe" class="pl-10" bind:value={$formData.lastName} />
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<!-- Email Field -->
	<div>
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<div class="relative">
						<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
							<Mail size={18} />
						</span>
						<Input
							placeholder="faculty@dmmmsu.edu.ph"
							{...props}
							class="pl-10"
							bind:value={$formData.email}
							required
						/>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<!-- Password Field -->
	<div>
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
	</div>

	<!-- Confirm Password -->
	<div>
		<Form.Field {form} name="passwordRepeat">
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
							bind:value={$formData.passwordRepeat}
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
	</div>

	<!-- Terms and Conditions -->
	<div class="flex items-start">
		<Form.Field {form} name="agree" class="flex flex-row items-start space-x-3 space-y-0 p-4">
			<Form.Control>
				{#snippet children({ props })}
					<Checkbox {...props} bind:checked={$formData.agree} />
					<div class="space-y-1 leading-none">
						<Form.Label>I agree to the</Form.Label>
						<Form.Description>
							<a
								href="https://example.com/terms"
								target="_blank"
								class="text-blue-600 hover:underline">Terms and Conditions</a
							>
							and
							<a
								href="https://example.com/privacy"
								target="_blank"
								class="text-blue-600 hover:underline">Privacy Policy</a
							>
						</Form.Description>
					</div>
				{/snippet}
			</Form.Control>
		</Form.Field>
	</div>

	<!-- Submit Button -->
	{#if $delayed}
		<Form.Button disabled class="mt-2 w-full"
			><LoaderCircle class="animate-spin" />Processing...</Form.Button
		>
	{:else}
		<Form.Button class="mt-2 w-full">Sign Up</Form.Button>
	{/if}
</form>
