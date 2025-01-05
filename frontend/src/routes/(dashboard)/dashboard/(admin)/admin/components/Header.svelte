<script>
	import { fade, fly } from 'svelte/transition';

	let { title, description } = $props();
</script>

<div class="bg-background/50 w-full p-4 backdrop-blur">
	<div class="space-y-1">
		<div transition:fly={{ y: -20, duration: 400 }}>
			<h3 class="text-xl font-medium">{title}</h3>
		</div>
		<div transition:fade={{ duration: 400 }}>
			<p class="text-muted-foreground text-sm">
				{description}
			</p>
		</div>
	</div>
</div>
