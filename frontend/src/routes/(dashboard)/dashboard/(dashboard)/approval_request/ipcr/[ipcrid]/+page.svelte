<script lang="ts">
	import type { PageData } from './$types';
	import Index from './components/index.svelte';
	import Header from './extra/header.svelte';
	import { setIpcrIndicatorFormContext } from './states/indicator_form_state';
	import { setSupervisorDetailStore } from './states/ipcr_supervisor_state';
	import { setSupervisorStore } from './states/supervisor_id_state';

	let { data }: { data: PageData } = $props();
	setSupervisorStore(data.supervisorId);
	setIpcrIndicatorFormContext(data.forms.indicatorForm);
	setSupervisorDetailStore(data.immediateSupervisorStatus[0]);
</script>

<div class="relative min-h-screen pb-24">
	<div class="h-full w-full">
		<Header ipcr={data.ipcr} ownerProfile={data.ownerProfile} />
		<Index ipcrFunctions={data.ipcrFunctions} />
	</div>
</div>
