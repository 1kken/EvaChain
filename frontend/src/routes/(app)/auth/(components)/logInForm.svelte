<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { LoaderCircle, Lock } from 'lucide-svelte';
	import { EyeOff } from 'lucide-svelte';
	import { Eye } from 'lucide-svelte';
	import { Mail } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { logInSchema, type LogInSchema } from '../(data)/schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '$lib/components/ui/input';
	import { showErrorToast } from '$lib/utils/toast';
	import google from '$lib/assets/google.svg';
	type Props = {
		data: SuperValidated<Infer<LogInSchema>>;
	};
	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(logInSchema)
	});

	const { form: formData, message, delayed, enhance: logInEnhance } = form;

	$effect(() => {
		if ($message?.status === 'error') {
			showErrorToast($message.text);
		}
	});
	// Password visibility state
	let showPassword: boolean = $state(false);
</script>

<!-- Auth Form -->
<form method="POST" action="?/login" use:logInEnhance>
	<!-- Email Field-->
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
							class="pl-10"
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
	<div class="mb-2 mt-1 text-right">
		{#if $delayed}
			<Form.Button class="mt-2 w-full" disabled
				><LoaderCircle class="animate-spin" />Processing...</Form.Button
			>
		{:else}
			<Button type="submit" class="w-full rounded-lg px-4 py-2 transition duration-200"
				>Log In</Button
			>
		{/if}
		<a
			href="/auth/recovery/email"
			class="text-sm text-emerald-600 underline hover:text-emerald-600"
		>
			Forgot password?
		</a>
	</div>
</form>
<!-- Divider -->
<div class="relative">
	<div class="absolute inset-0 flex items-center">
		<div class="w-full border-t border-emerald-300/40"></div>
	</div>
	<div class="relative flex justify-center text-sm">
		<span class="bg-white px-2 text-emerald-700">Or continue with</span>
	</div>
</div>
<Button
	href="/auth/google"
	type="button"
	class="flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-2 transition duration-200 "
>
	<img src={google} alt="Google" class="h-5 w-5" />
	<span>Google</span>
</Button>
