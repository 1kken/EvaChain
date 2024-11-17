<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Tables } from '$lib/types/database.types.js';
	import { authStore } from '$lib/utils/authStore.js';
	import { onMount, setContext } from 'svelte';

	let { data, children } = $props();
	onMount(() => {
		authStore.fetchProfile(data.supabase);
	});
</script>

<main>
	{@render children()}
</main>
