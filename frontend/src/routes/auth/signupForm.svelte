<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	import { signupSchema, type SignupSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	type Props = {
		data: SuperValidated<Infer<SignupSchema>>;
	};
	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(signupSchema)
	});

	const { form: formData, enhance: logInEnhance } = form;
</script>

<Card.Root>
	<Card.Content>
		<form method="POST" action="?/signup" use:logInEnhance>
			<div class="grid grid-cols-2 gap-2">
				<Form.Field {form} name="firstName">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>First Name</Form.Label>
							<Input {...props} bind:value={$formData.firstName} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="lastName">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Last Name</Form.Label>
							<Input {...props} bind:value={$formData.lastName} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
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
			<Form.Field {form} name="passwordRepeat">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Confirm Password</Form.Label>
						<Input {...props} bind:value={$formData.passwordRepeat} type="password" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Button class="mt-2 w-full">Sign Up</Form.Button>
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
