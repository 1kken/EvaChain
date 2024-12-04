<script lang="ts">
	import BorderBeam from '$lib/magic-ui/BorderBeam.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { PageData } from '../$types';
	import LogInForm from './logInForm.svelte';
	import SignupForm from './signupForm.svelte';
	import type { LogInSchemaInferred, SignupSchemaInferred } from '../(data)/schema';

	interface AuthFormProps {
		logIn: SuperValidated<LogInSchemaInferred>;
		signUp: SuperValidated<SignupSchemaInferred>;
	}
	const { form }: { form: AuthFormProps } = $props();
	const { logIn, signUp } = form;
	// Form type state
	let isLogin: boolean = $state(true);
</script>

<div class="relative w-full max-w-md space-y-6 rounded-lg p-6 shadow-md backdrop-blur-sm">
	<BorderBeam size={150} duration={12} />
	<div class="text-center">
		<h1 class="text-2xl font-bold">
			{isLogin ? 'Welcome Back' : 'Create Account'}
		</h1>
		<p class="mt-2 text-gray-500">
			{isLogin ? 'Please enter your credentials' : 'Fill in your information to get started'}
		</p>
	</div>

	{#if isLogin}
		<LogInForm data={logIn} />
	{:else}
		<SignupForm data={signUp} />
	{/if}

	<!-- Form Switch -->
	<div class="text-center text-sm">
		<p class="text-gray-600">
			{isLogin ? "Don't have an account?" : 'Already have an account?'}
			<button
				onclick={() => (isLogin = !isLogin)}
				class="ml-1 font-medium text-blue-600 hover:text-blue-700"
			>
				{isLogin ? 'Sign Up' : 'Log In'}
			</button>
		</p>
	</div>
</div>
