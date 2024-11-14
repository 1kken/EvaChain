<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import Navbar from '$lib/components/custom/navbar.svelte';
	import Footer from '$lib/components/custom/footer.svelte';
	import { Toaster } from 'svelte-sonner';
	let { children, data } = $props();

	let { session, supabase } = $derived(data);

	$effect(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<Toaster richColors position="top-center" />
<Navbar />
{@render children()}
<Footer />
