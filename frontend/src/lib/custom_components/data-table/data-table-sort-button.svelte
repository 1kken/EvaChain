<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	import ArrowUp from 'lucide-svelte/icons/arrow-up';
	import ArrowDown from 'lucide-svelte/icons/arrow-down';
	import { Button } from '$lib/components/ui/button/index.js';

	interface ExtendedButtonProps extends ComponentProps<typeof Button> {
		text: string;
		arrangement: false | 'asc' | 'desc';
	}

	let { variant = 'ghost', text, arrangement, ...restProps }: ExtendedButtonProps = $props();
</script>

<Button {variant} {...restProps}>
	{text}
	{#if arrangement === false}
		<ArrowUpDown class="ml-2 size-4 transition-opacity hover:-translate-y-0.5" />
	{:else if arrangement === 'asc'}
		<ArrowUp class="text-primary ml-2 size-4 transition-all" />
	{:else}
		<ArrowDown class="text-primary ml-2 size-4 transition-all" />
	{/if}
</Button>
