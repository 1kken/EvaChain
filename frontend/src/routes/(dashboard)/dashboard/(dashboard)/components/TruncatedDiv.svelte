<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	// Component props
	let { text, maxLength = 50 }: { text: string; maxLength?: number } = $props();

	// State for tracking if text is expanded
	let isExpanded: boolean = $state(false);

	// Compute truncated text based on maxLength
	const truncatedText = $derived(
		!isExpanded && text.length > maxLength ? text.slice(0, maxLength) + '... ' : text
	);

	/** Toggle expanded state */
	const toggleExpand = (
		e:
			| (MouseEvent & { currentTarget: EventTarget & HTMLButtonElement })
			| (MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement })
	) => {
		isExpanded = !isExpanded;
		e.preventDefault();
		e.stopPropagation();
	};
</script>

<div class="space-y-2">
	<p class="text-sm leading-7">
		{truncatedText}
		{#if text.length > maxLength}
			<Button
				variant="link"
				size="sm"
				onclick={(e) => {
					toggleExpand(e);
				}}
				class="h-auto px-0 font-medium"
			>
				{isExpanded ? 'see less' : 'see more'}
			</Button>
		{/if}
	</p>
</div>
