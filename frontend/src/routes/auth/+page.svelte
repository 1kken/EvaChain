<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Box, Rocket } from 'lucide-svelte';
	import type { PageData } from './$types';
	import LogInForm from './logInForm.svelte';
	let { data }: { data: PageData } = $props();
</script>

<div class="grid h-[90vh] place-items-center">
	<div
		class=" grid w-3/4 place-items-center overflow-hidden rounded-md p-4 backdrop-blur-md lg:h-[100%] lg:w-[80%] lg:grid-cols-2"
	>
		<div class="justify relative m-2 flex flex-col items-center">
			<div class="space-y-2 text-center">
				<h1 class="text-2xl font-bold">WELCOME TO EvaChain</h1>
				<p class="text-sm opacity-90">
					Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
					commodo consequat.
				</p>
			</div>
			<div class="relative mt-8">
				<div class="flex h-32 w-32 items-center justify-center rounded-full bg-green-800">
					<Box class="h-16 w-16 text-white" />
				</div>
				<div class="absolute inset-0 flex items-center justify-center">
					<div class="h-3 w-3 animate-ping rounded-full bg-white/20"></div>
				</div>
			</div>
		</div>
		<div class="z-10 grid items-center lg:h-full">
			<Tabs.Root value="login">
				<Tabs.List class="grid grid-cols-2 items-center">
					<Tabs.Trigger value="login">Log in</Tabs.Trigger>
					<Tabs.Trigger value="signup">Sign up</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="login">
					<LogInForm data={data.form.logIn} />
				</Tabs.Content>
				<Tabs.Content value="signup">Change your password here.</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</div>
