<script lang="ts">
	import type { Tables } from '$lib/types/database.types';
	import { Upload } from 'lucide-svelte';
	import { getImgUrl } from './img-url.svelte';

	let { profile }: { profile: Tables<'profiles'> } = $props();
</script>

<div
	class="group relative overflow-hidden rounded-full border p-0 transition-all duration-200 hover:brightness-95"
>
	{#if getImgUrl()}
		<img
			src={getImgUrl()}
			alt={`${profile.first_name} ${profile.last_name}`}
			class="h-24 w-24 object-cover"
		/>
	{:else}
		<div class="flex h-24 w-24 items-center justify-center bg-gray-100 text-lg text-gray-500">
			{profile.first_name?.[0]}{profile.last_name?.[0]}
		</div>
	{/if}

	<!-- Upload overlay -->
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
