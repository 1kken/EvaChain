<script lang="ts">
	let { activity, indicator }: { activity: string; indicator: string } = $props();
</script>

<div class="space-y-2">
	<h1 class="text-3xl font-bold tracking-tight md:text-4xl">{activity}</h1>
	<p class="text-muted-foreground text-lg">{indicator}</p>
</div>
