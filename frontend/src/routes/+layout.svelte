<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import Navbar from '$lib/custom_components/navbar.svelte';
	import Footer from '$lib/custom_components/footer.svelte';
	import { Toaster } from 'svelte-sonner';
	import { setAuthStore } from '$lib/utils/authStore';
	import { ModeWatcher } from 'mode-watcher';
	let { children, data } = $props();

	let { session, supabase } = $derived(data);

	const authStore = setAuthStore();
	$effect(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (event === 'SIGNED_OUT') {
				authStore.clearProfile();
			}
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<Toaster richColors position="top-right" closeButton />
<ModeWatcher />
{@render children()}
<Footer />
