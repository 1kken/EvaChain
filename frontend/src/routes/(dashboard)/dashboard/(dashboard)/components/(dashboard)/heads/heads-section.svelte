<script lang="ts">
	import { getUserAuthStore } from '$lib/utils/rbac';
	import AcademicRow from './academic-row.svelte';
	import AccomplishmentRow from './accomplishment-row.svelte';
	import IpcrAnalysis from './ipcr-analysis.svelte';

	const { hasRole } = getUserAuthStore();
</script>

<div class="w-full">
	<div class="flex w-full flex-col items-center justify-center gap-2 sm:flex-row">
		<AcademicRow />
	</div>
	<div class=" mt-4 flex w-full flex-col items-center justify-center gap-2 sm:flex-row">
		<AccomplishmentRow />
	</div>

	<div class="mt-4 flex w-full flex-col items-center justify-center gap-2 sm:flex-row">
		<IpcrAnalysis />
	</div>
</div>
