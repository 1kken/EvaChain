<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	let {
		title,
		required = false,
		children
	}: { title: string; required?: boolean; children: Snippet } = $props();
</script>

<div class="space-y-4">
	<h3 class={cn('text-lg font-semibold', required && 'required')}>{title}</h3>
	<div
		class="bg-muted/50 border-border hover:border-muted-foreground/25 rounded-lg border p-4 transition-colors"
	>
		{@render children()}
	</div>
</div>
