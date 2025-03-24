<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
</script>

<div class="flex h-full w-full flex-col">
	<!-- Header row with different styling -->
	<div class="mb-4 w-full">
		<div class="mb-2 flex items-center justify-between">
			<Skeleton class="h-[36px] w-[280px] rounded-md" />
			<div class="flex space-x-2">
				<Skeleton class="h-[36px] w-[120px] rounded-md" />
				<Skeleton class="h-[36px] w-[120px] rounded-md" />
			</div>
		</div>
		<div class="flex w-full space-x-2">
			<Skeleton class="h-[36px] w-1/4 rounded" />
			<Skeleton class="h-[36px] w-1/4 rounded" />
			<Skeleton class="h-[36px] w-1/4 rounded" />
			<Skeleton class="h-[36px] w-1/4 rounded" />
		</div>
	</div>

	<!-- Table body rows -->
	<div class="w-full flex-1">
		{#each Array(8) as _, i}
			<div class="mb-2 flex w-full space-x-2">
				<Skeleton class="h-[24px] w-1/4 rounded" />
				<Skeleton class="h-[24px] w-1/4 rounded" />
				<Skeleton class="h-[24px] w-1/4 rounded" />
				<Skeleton class="h-[24px] w-1/4 rounded" />
			</div>
		{/each}
	</div>
</div>
