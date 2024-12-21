<script lang="ts">
	import { fade, fly } from 'svelte/transition';
</script>

<div class="bg-background/50 backdrop-blur">
	<div class="space-y-1">
		<div transition:fly={{ y: -20, duration: 400 }}>
			<h3 class="text-xl font-medium">Program Management</h3>
		</div>
		<div transition:fade={{ duration: 400 }}>
			<p class="text-muted-foreground text-sm">
				Manage your programs, objectives, and activities efficiently
			</p>
		</div>
	</div>
</div>
