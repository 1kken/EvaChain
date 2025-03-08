<script lang="ts">
	import { getUserAuthStore } from '$lib/utils/rbac';
	import TeachingEffectivenessTechnicalAdmin from './teaching-effectiveness-technical-admin.svelte';

	const { hasRole } = getUserAuthStore();
</script>

<div class="w-full">
	<div class="flex w-full flex-col items-center justify-center gap-2 sm:flex-row">
		<TeachingEffectivenessTechnicalAdmin />
	</div>
</div>
