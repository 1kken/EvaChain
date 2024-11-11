<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Box, Rocket } from 'lucide-svelte';
	import type { PageData } from './$types';
	import LogInForm from './logInForm.svelte';
	import SignupForm from './signupForm.svelte';
	let { data }: { data: PageData } = $props();
</script>

<div class="grid h-full border lg:w-96">
	<Tabs.Root value="login">
		<Tabs.List class="grid grid-cols-2 items-center">
			<Tabs.Trigger value="login">Log in</Tabs.Trigger>
			<Tabs.Trigger value="signup">Sign up</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="login">
			<LogInForm data={data.form.logIn} />
		</Tabs.Content>
		<Tabs.Content value="signup"><SignupForm data={data.form.signUp} /></Tabs.Content>
	</Tabs.Root>
</div>
