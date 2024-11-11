<script>
	import Navbar from '$lib/components/custom/navbar.svelte';
	import Footer from '$lib/components/custom/footer.svelte';
</script>

<div class="relative h-screen w-full overflow-hidden">
	<div class="bg-auth-bg animate-custom-ping absolute inset-0 bg-cover bg-no-repeat"></div>
	<div class="relative z-10">
		<Navbar />
		<slot />
		<Footer />
	</div>
</div>
