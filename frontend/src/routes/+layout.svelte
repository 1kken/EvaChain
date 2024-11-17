<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import Navbar from '$lib/components/custom/navbar.svelte';
	import Footer from '$lib/components/custom/footer.svelte';
	import { Toaster } from 'svelte-sonner';
	import { authStore } from '$lib/utils/authStore';
	let { children, data } = $props();

	let { session, supabase } = $derived(data);

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

<Toaster richColors position="top-right" />
<Navbar />
{@render children()}
<Footer />
