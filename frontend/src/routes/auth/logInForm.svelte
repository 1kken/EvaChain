<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { logInSchema, type LogInSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Button } from '$lib/components/ui/button';
	type Props = {
		data: SuperValidated<Infer<LogInSchema>>;
	};
	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(logInSchema)
	});

	const { form: formData, enhance: logInEnhance } = form;
</script>

<div>
	<form method="POST" action="?/login" use:logInEnhance>
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<Input {...props} bind:value={$formData.email} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Password</Form.Label>
					<Input {...props} bind:value={$formData.password} type="password" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button class="mt-2 w-full">Log In</Form.Button>
	</form>
	<div class="grid w-full grid-cols-1 place-items-center gap-3">
		<h3>or</h3>
		<Button>Continue with Google</Button>
		<h2>Dont have an account? Signup here.</h2>
	</div>
</div>
