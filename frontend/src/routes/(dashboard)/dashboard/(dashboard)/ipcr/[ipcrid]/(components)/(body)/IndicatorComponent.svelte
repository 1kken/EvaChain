<script lang="ts">
	import type { Tables } from '$lib/types/database.types';

	// Props
	let { indicator }: { indicator: Tables<'indicator'> } = $props();
</script>

<div class="rounded-lg border">
	<div class="flex min-h-[3.5rem] items-center justify-between p-3">
		<div class="flex items-center gap-2">
			<h4 class=" text-base">{indicator.indicator}</h4>
		</div>
	</div>
</div>
