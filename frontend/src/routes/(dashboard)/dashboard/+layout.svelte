<script lang="ts">
	import { getAuthStore } from '$lib/utils/authStore.js';
	import { onMount } from 'svelte';
	import type { LayoutProps } from './$types';
	import { setNotificationStore } from '$lib/utils/notificationStore';

	let { data, children }: LayoutProps = $props();
	const authStore = getAuthStore();
	const { initializeRealtimeSubscription } = setNotificationStore(data.supabase, data.userId!);

	onMount(() => {
		authStore.fetchProfile(data.supabase);
		const notificationRealtimeSubscription = initializeRealtimeSubscription();
		return notificationRealtimeSubscription;
	});
</script>

<main>
	{@render children?.()}
</main>
