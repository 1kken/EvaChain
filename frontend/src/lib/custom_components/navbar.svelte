<script lang="ts">
	import { goto, preloadData } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { getAuthStore } from '$lib/utils/authStore';
	import SheetNav from './sheet_nav.svelte';
	import logo from '$lib/assets/icon.png';

	let currPathName: String = $state($page.url.pathname);
	const { isAuthenticated, currentProfile } = getAuthStore();
	$effect(() => {
		currPathName = $page.url.pathname;
	});

	function goToAuthPage() {
		preloadData('/auth');
		goto('/auth');
	}

	function goToDashBoard() {
		preloadData('/dashboard');
		goto('/dashboard');
	}
</script>

<nav class="border-gray-200 bg-transparent shadow-lg dark:bg-gray-900">
	<div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
		<a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
			<img src={logo} class="h-8" alt="EvaChain Logo" />
			<span
				class="text-foreground self-center whitespace-nowrap text-2xl font-semibold dark:text-white"
				>EvaChain</span
			>
		</a>
		<div>
			{#if currPathName === '/' && !$isAuthenticated}
				<Button onclick={goToAuthPage}>Log-in/Sign-up</Button>
			{/if}
			{#if currPathName === '/' && $isAuthenticated}
				<Button onclick={goToDashBoard}>Go to dashboard</Button>
			{/if}
			{#if currPathName !== '/' && $isAuthenticated}
				{#if $currentProfile}
					<SheetNav profile={$currentProfile} />
				{/if}
			{/if}
		</div>
	</div>
</nav>
