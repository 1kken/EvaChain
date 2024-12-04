<script lang="ts">
	import Particles from '$lib/magic-ui/Particles.svelte';
	import { onMount } from 'svelte';
	import Navbar from '$lib/custom_components/navbar.svelte';
	let { children } = $props();
	let particleCount = $state(50); // Default count

	function updateParticleCount() {
		particleCount = window.innerWidth < 768 ? 8 : 20;
	}

	onMount(() => {
		updateParticleCount(); // Initial check
		window.addEventListener('resize', updateParticleCount);
		return () => window.removeEventListener('resize', updateParticleCount);
	});
</script>

<Navbar />
<main class="relative min-h-screen">
	<Particles className="absolute inset-0 -z-10 w-screen h-screen" quantity={particleCount} />
	<div class="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4">
		{@render children()}
	</div>
</main>
