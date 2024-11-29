<script lang="ts">
	import { Upload } from 'lucide-svelte';
	import { getAuthStore } from '$lib/utils/authStore';
	let { currentProfile } = getAuthStore();
</script>

<div
	class="group relative overflow-hidden rounded-full border p-0 transition-all duration-200 hover:brightness-95"
>
	{#if $currentProfile && $currentProfile.avatar_url}
		<img
			src={$currentProfile.avatar_url}
			alt={`${$currentProfile?.first_name} ${$currentProfile?.last_name}`}
			class="h-24 w-24 object-cover"
		/>
	{:else}
		<div class="flex h-24 w-24 items-center justify-center bg-gray-100 text-lg text-gray-500">
			{$currentProfile?.first_name?.[0]}{$currentProfile?.last_name?.[0]}
		</div>
	{/if}
	<div
		class="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:backdrop-blur-sm"
	>
		<div class="flex flex-col items-center">
			<Upload
				size={20}
				class="text-white opacity-0 transition-all duration-200 group-hover:opacity-100"
			/>
			<span
				class="text-[8px] text-white opacity-0 transition-all duration-200 group-hover:opacity-100"
			>
				Upload profile picture
			</span>
		</div>
	</div>
</div>
