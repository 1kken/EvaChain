<script lang="ts">
	import type { PageData } from './$types';
	import Index from './components/index.svelte';
	import Header from './extra/header.svelte';
	import { setSupervisorStore } from './states/supervisor_id_state';

	let { data }: { data: PageData } = $props();
	setSupervisorStore(data.supervisorId);
</script>

<div class="relative min-h-screen pb-24">
	<!-- Main content -->
	<div class="h-full w-full">
		<Header ipcr={data.ipcr} ownerProfile={data.ownerProfile} />
		<Index ipcrFunctions={data.ipcrFunctions} />
	</div>
</div>
