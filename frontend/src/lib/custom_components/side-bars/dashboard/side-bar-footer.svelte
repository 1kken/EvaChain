<script lang="ts">
	let { isDrawerOpen = $bindable() } = $props();
	import { ChevronUp } from 'lucide-svelte';
	import { LogOut } from 'lucide-svelte';
	import { UserRoundPen } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { currentProfile } from '$lib/utils/authStore';
	import * as Avatar from '$lib/components/ui/avatar';
	import type { Tables } from '$lib/types/database.types';

	const profileId = $page.data.session?.user.id;
	let profile: Tables<'profiles'> | null = $state(null);

	$effect(() => {
		profile = $currentProfile;
	});
	async function handleLogOut() {
		const { error } = await $page.data.supabase.auth.signOut();
		if (error) throw error;
		await goto('/auth');
	}

	async function handleProfileNavigation() {
		await goto(`/dashboard/profile/view/${profileId}`);
	}
</script>

<Sidebar.Footer>
	<Sidebar.Menu>
		<Sidebar.MenuItem>
			<DropdownMenu.Root
				onOpenChange={(drawerState) => {
					isDrawerOpen = drawerState;
				}}
			>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Sidebar.MenuButton
							{...props}
							class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-green-600"
						>
							<Avatar.Root class="ml-0">
								<Avatar.Image
									src={profile?.avatar_url ?? undefined}
									alt={profile?.first_name ?? 'User avatar'}
								/>
								<Avatar.Fallback>
									{(profile?.first_name?.[0] ?? '') + (profile?.last_name?.[0] ?? '')}
								</Avatar.Fallback>
							</Avatar.Root>
							<span>{profile?.first_name} {profile?.last_name}</span>
							<ChevronUp class="ml-auto" />
						</Sidebar.MenuButton>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content side="top" class="w-[--bits-dropdown-menu-anchor-width]">
					<DropdownMenu.Item onclick={handleProfileNavigation}>
						<div class="flex w-fit gap-4">
							<UserRoundPen />
							<h3>Profile</h3>
						</div>
					</DropdownMenu.Item>
					<DropdownMenu.Item onclick={handleLogOut}>
						<div class="flex gap-4 text-sm">
							<LogOut />
							<span>Log-out</span>
						</div>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Sidebar.MenuItem>
	</Sidebar.Menu>
</Sidebar.Footer>
