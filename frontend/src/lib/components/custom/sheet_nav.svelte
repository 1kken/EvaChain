<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Separator } from '$lib/components/ui/separator';
	import type { Tables } from '$lib/types/database.types';
	import { UserRoundPen } from 'lucide-svelte';
	import { LogOut } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let loading = $state(false);

	async function handleLogOut() {
		if (loading) return;
		loading = true;

		try {
			const { error } = await $page.data.supabase.auth.signOut();
			if (error) throw error;
			await goto('/auth');
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			loading = false;
		}
	}

	let { profile }: { profile: Tables<'profiles'> | null } = $props();
</script>

<div class="flex items-center gap-2">
	<Sheet.Root>
		<Sheet.Trigger class=" focus:outline-none">
			<Avatar.Root>
				<Avatar.Image
					src={profile?.avatar_url ?? undefined}
					alt={profile?.first_name ?? 'User avatar'}
				/>
				<Avatar.Fallback>
					{(profile?.first_name?.[0] ?? '') + (profile?.last_name?.[0] ?? '')}
				</Avatar.Fallback>
			</Avatar.Root>
		</Sheet.Trigger>
		<Sheet.Content side="right">
			<Sheet.Header>
				<div class="flex h-fit w-fit items-center gap-4">
					<Avatar.Root>
						<Avatar.Image
							src={profile?.avatar_url ?? undefined}
							alt={profile?.first_name ?? 'User avatar'}
						/>
						<Avatar.Fallback>
							{(profile?.first_name?.[0] ?? '') + (profile?.last_name?.[0] ?? '')}
						</Avatar.Fallback>
					</Avatar.Root>
					<h1>{profile?.first_name + ' ' + profile?.last_name}</h1>
				</div>
				<Separator />
			</Sheet.Header>
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-1.5">
					<h1 class=" text-gray-500">Account</h1>
					<a href="/dashboard/profile/{profile?.id}" class="hover:text-green-900">
						<div class="flex w-fit gap-1.5">
							<UserRoundPen />
							<h3>Profile</h3>
						</div>
					</a>
				</div>
				<Separator />
				<div>
					<button
						class=" flex w-fit cursor-pointer gap-1.5 border-none hover:text-green-900 focus:outline-none disabled:opacity-50"
						onclick={handleLogOut}
						disabled={loading}
					>
						<LogOut />
						<h5>Log-out</h5>
					</button>
				</div>
			</div>
		</Sheet.Content>
	</Sheet.Root>
</div>
