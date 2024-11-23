<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	import { Button } from '$lib/components/ui/button/index.js';

	// Define an interface that extends Button props and adds text property
	interface ExtendedButtonProps extends ComponentProps<typeof Button> {
		text: string;
	}

	let { variant = 'ghost', text, ...restProps }: ExtendedButtonProps = $props();
</script>

<Button {variant} {...restProps}>
	{text}
	<ArrowUpDown class="ml-2 size-4" />
</Button>
