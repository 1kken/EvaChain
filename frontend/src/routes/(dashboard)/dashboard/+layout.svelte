<script lang="ts">
	import { getAuthStore } from '$lib/utils/authStore.js';
	import { onMount } from 'svelte';

	let { data, children } = $props();
	const authStore = getAuthStore();
	onMount(() => {
		authStore.fetchProfile(data.supabase);
	});
</script>

<main>
	{@render children?.()}
</main>
