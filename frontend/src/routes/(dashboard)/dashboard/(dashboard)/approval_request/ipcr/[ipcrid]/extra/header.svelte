<script lang="ts">
	import type { Tables } from '$lib/types/database.types';
	import { fade, fly } from 'svelte/transition';
	import { titleCase } from 'title-case';

	let {
		ipcr,
		ownerProfile
	}: {
		ipcr: Tables<'ipcr'>;
		ownerProfile: Tables<'profiles'>;
	} = $props();

	let firstName = ownerProfile.first_name ?? '';
	let middleName = ownerProfile.middle_name ?? '';
	let lastName = ownerProfile.last_name ?? '';
</script>

<div class="bg-background/50 w-full p-4 backdrop-blur">
	<div class="flex items-start justify-between">
		<div class="space-y-1">
			<div transition:fly={{ y: -20, duration: 400 }}>
				<h3 class="text-xl font-medium">{ipcr.title}</h3>
			</div>
			<div transition:fade={{ duration: 400 }}>
				<p class="text-muted-foreground text-sm">
					By: {titleCase(firstName)}
					{titleCase(middleName)}
					{titleCase(lastName)}
				</p>
			</div>
			<div transition:fade={{ duration: 400 }}>
				<p class="text-muted-foreground text-sm">Email: {ownerProfile.email}</p>
			</div>
		</div>
	</div>
</div>
