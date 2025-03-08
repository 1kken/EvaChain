<script lang="ts">
	import { getUserAuthStore } from '$lib/utils/rbac';
	import DeanProgramChairSection from './dean-program_chair/dean-program-chair-section.svelte';

	const { hasRole } = getUserAuthStore();
</script>

<div class="w-full">
	{#if hasRole('dean') || hasRole('program_chair')}
		<div class="flex w-full flex-col items-center justify-center gap-2 sm:flex-row">
			<DeanProgramChairSection />
		</div>
	{/if}
</div>
