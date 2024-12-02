<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import backgroundSvg from '$lib/assets/backgroundSvg.svg';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<div class="relative min-h-screen w-full">
	<img
		src={backgroundSvg}
		alt="Background"
		class="fixed left-0 top-0 -z-10 h-full w-full object-cover"
	/>
	<div class="relative z-10 p-4">
		{@render children()}
	</div>
</div>
