<script lang="ts">
	import { authStore } from '$lib/utils/authStore.js';
	import { onMount } from 'svelte';

	let { data, children } = $props();
	onMount(() => {
		authStore.fetchProfile(data.supabase);
	});
</script>

<main>
	{@render children?.()}
</main>
