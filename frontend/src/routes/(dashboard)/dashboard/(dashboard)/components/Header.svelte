<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import IpcrSupervisorDetails from '../ipcr/[ipcrid]/extra/ipcr-supervisor-details.svelte';
	import type { Tables } from '$lib/types/database.types';

	let {
		title,
		description,
		supervisors
	}: { title: String; description: String; supervisors: Tables<'ipcr_supervisor_details_view'>[] } =
		$props();
</script>

<div class="bg-background/50 w-full p-4 backdrop-blur">
	<div class="flex items-start justify-between">
		<div class="space-y-1">
			<div transition:fly={{ y: -20, duration: 400 }}>
				<h3 class="text-xl font-medium">{title}</h3>
			</div>
			<div transition:fade={{ duration: 400 }}>
				<p class="text-muted-foreground text-sm">
					{description}
				</p>
			</div>
		</div>

		<div class="ml-auto">
			<IpcrSupervisorDetails {supervisors} title={'IPCR Status'} />
		</div>
	</div>
</div>
