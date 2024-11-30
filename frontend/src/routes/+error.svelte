<script lang="ts">
	import errorbot from '$lib/assets/errorbot.svg';
	import { page } from '$app/stores';
</script>

<div class="flex min-h-screen items-center justify-center px-4 md:px-8">
	<div class="container flex flex-col items-center justify-center gap-8 md:flex-row md:gap-16">
		<div class="w-64 md:w-[450px]">
			<img src={errorbot} alt="errorbot" class="h-full w-full" />
		</div>
		<div class="space-y-6 text-center md:text-left">
			<h1 class="text-7xl font-bold md:text-8xl">{$page.status}</h1>
			<p class=" max-w-80 text-xl md:text-2xl">{$page.error?.message || 'Page not found'}</p>
			<div>
				<a
					href="/dashboard"
					class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
				>
					Go Home
				</a>
			</div>
		</div>
	</div>
</div>
