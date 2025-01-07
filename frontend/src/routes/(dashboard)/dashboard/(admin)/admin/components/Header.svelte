<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { fade, fly } from 'svelte/transition';

	type BadgeType = 'secondary' | 'outline' | 'destructive';

	interface Props {
		title: string;
		description: string;
		showBadge?: boolean;
		badgeText?: string;
		badgeType?: BadgeType;
	}

	let {
		title,
		description,
		showBadge = false,
		badgeText = undefined,
		badgeType = undefined
	}: Props = $props();
</script>

<div class="bg-background/50 w-full p-4 backdrop-blur">
	<div class="space-y-1">
		<div transition:fly={{ y: -20, duration: 400 }} class="flex items-center space-x-2">
			<h3 class="text-xl font-medium">{title}</h3>
			{#if showBadge}
				<Badge type={badgeType ?? ''}>{badgeText}</Badge>
			{/if}
		</div>
		<div transition:fade={{ duration: 400 }}>
			<p class="text-muted-foreground text-sm">
				{description}
			</p>
		</div>
	</div>
</div>
