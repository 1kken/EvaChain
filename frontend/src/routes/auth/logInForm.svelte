<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Boxes } from 'lucide-svelte';
	import { showErrorToast, showSuccessToast } from '$lib/utils/toast';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { logInSchema, type LogInSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	type Props = {
		data: SuperValidated<Infer<LogInSchema>>;
	};
	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(logInSchema)
	});

	const { form: formData, enhance: logInEnhance } = form;
	$effect(() => {
		if ($page.form?.success) {
			showSuccessToast($page.form.message);
		} else if ($page.form?.message) {
			showErrorToast($page.form.message);
		}
	});
</script>

<div></div>

<Card.Root>
	<Card.Content>
		<Card.CardHeader class="flex items-center">
			<Card.Title>Welcome Back to EvaChain!</Card.Title>
			<Card.Description>
				<Boxes class=" h-24 w-24" />
			</Card.Description>
		</Card.CardHeader>
		<form method="POST" action="?/login" use:logInEnhance>
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input placeholder="Enter Email" {...props} bind:value={$formData.email} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Password</Form.Label>
						<Input
							placeholder="Enter Password"
							{...props}
							bind:value={$formData.password}
							type="password"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="flex justify-end"></div>
			<Form.Button class="mt-2 w-full">Log In</Form.Button>
		</form>
		<div class="grid w-full grid-cols-1 place-items-center gap-3">
			<div class="flex w-full items-center text-gray-900">
				<hr class="flex-grow border-green-700" />
				<h3 class="px-3">or</h3>
				<hr class="flex-grow border-green-700" />
			</div>
			<Button href="/auth/google">Continue with Google</Button>
		</div>
	</Card.Content>
</Card.Root>
