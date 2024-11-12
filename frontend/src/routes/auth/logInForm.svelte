<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

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
</script>

<div></div>

<Card.Root>
	<Card.Content>
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
			<div class="flex justify-end">
				<a href="#"><p class="text-sm text-gray-600">forgot password?</p></a>
			</div>
			<Form.Button class="mt-2 w-full">Log In</Form.Button>
		</form>
		<div class="grid w-full grid-cols-1 place-items-center gap-3">
			<div class="grid w-max grid-cols-3 items-center text-gray-600">
				<hr />
				<h3>or</h3>
				<hr />
			</div>
			<Button href="/auth/google">Continue with Google</Button>
		</div>
	</Card.Content>
</Card.Root>
