<script lang="ts">
	import '../app.css';
	import { goto, invalidate } from '$app/navigation';
	import Footer from '$lib/custom_components/footer.svelte';
	import { Toaster } from 'svelte-sonner';
	import { setAuthStore } from '$lib/utils/authStore';
	import { ModeWatcher } from 'mode-watcher';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	injectSpeedInsights();

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
			if (event === 'PASSWORD_RECOVERY') {
				goto('/auth/reset-password');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<Toaster richColors position="top-right" closeButton duration={5000} />
<ModeWatcher />
{@render children()}
<Footer />
