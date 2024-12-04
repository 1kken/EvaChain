<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { data: test } = data;
</script>

{#if test}
	{#each test as t}
		{t.user_id} <br />
	{/each}
{/if}
