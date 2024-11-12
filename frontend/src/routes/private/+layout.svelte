<script lang="ts">
	import { goto } from '$app/navigation';

	let { data, children } = $props();
	async function logOut() {
		data.supabase.auth.signOut();
		goto('/');
	}
</script>

<header>
	<nav>
		<a href="/">Home</a>
	</nav>
	<button onclick={logOut}>Logout</button>
</header>
<main>
	{@render children()}
</main>
