<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { setIPCRStore } from './(data)/state.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const { ipcrs } = data;
	setIPCRStore(ipcrs);
</script>

{@render children()}
