<script>
	import { Home } from 'lucide-svelte';

	let { children, currentPath = '/' } = $props();

	// Determine home route based on current path
	let homeRoute = $derived.by(() => {
		return currentPath.startsWith('/admin') ? '/admin' : '/dashboard';
	});
</script>

<div class="flex items-center justify-center overflow-hidden rounded-xl border px-4 py-2 shadow-lg">
	<style>
		.button-container:has(#nav-1:hover) #nav-1 {
			transform: translateY(-5px);
		}
		.button-container:has(#nav-1:hover) #nav-2 {
			transform: translateY(-2px);
		}
		.button-container:has(#nav-1:hover) #nav-3 {
			transform: translateY(-0px);
		}
		.button-container:has(#nav-2:hover) #nav-2 {
			transform: translateY(-5px);
		}
		.button-container:has(#nav-2:hover) #nav-1 {
			transform: translateY(-2px);
		}
		.button-container:has(#nav-2:hover) #nav-3 {
			transform: translateY(-2px);
		}
		.button-container:has(#nav-3:hover) #nav-3 {
			transform: translateY(-5px);
		}
		.button-container:has(#nav-3:hover) #nav-2 {
			transform: translateY(-2px);
		}
		.button-container:has(#nav-3:hover) #nav-1 {
			transform: translateY(-0px);
		}
		[id^='nav-'] {
			transition: transform 0.6s ease;
		}
	</style>

	<div class="button-container flex flex-row items-center justify-center space-x-4">
		<!-- Fixed Home Icon -->
		<div class="group relative">
			<a href={homeRoute} class="flex items-center justify-center">
				<Home
					class="text-[hsl(var(--muted-foreground))] transition-colors duration-700 group-hover:text-[hsl(var(--primary))]"
					size={34}
				/>
			</a>
		</div>
		<div class="h-7 w-[2px] rounded-full bg-[hsl(var(--border))]"></div>

		<!-- Children Content -->
		{@render children()}
	</div>
</div>
