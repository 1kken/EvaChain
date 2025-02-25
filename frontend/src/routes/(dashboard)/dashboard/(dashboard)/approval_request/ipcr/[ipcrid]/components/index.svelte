<script lang="ts">
	import type { Tables } from '$lib/types/database.types';
	import Function from './function.svelte';

	interface Props {
		ipcrFunctions: Tables<'ipcr_function'>[];
	}

	let props: Props = $props();
</script>

{#each props.ipcrFunctions as ipcrFunction}
	<Function {ipcrFunction} />
{/each}
