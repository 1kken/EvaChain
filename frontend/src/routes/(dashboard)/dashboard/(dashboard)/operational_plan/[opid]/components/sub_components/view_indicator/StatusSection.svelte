<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';

	let {
		progress
	}: {
		progress: { q1: string | null; q2: string | null; q3: string | null; q4: string | null };
	} = $props();
</script>

<Card>
	<CardHeader>
		<CardTitle>Status Overview</CardTitle>
	</CardHeader>
	<CardContent class="space-y-6">
		<div>
			<span class="text-sm font-medium">Target Quarters</span>
			<div class="mt-2 flex items-center gap-4">
				{#each Object.entries(progress) as [quarter, target]}
					<div class="flex items-center gap-2">
						{quarter.toUpperCase()}:
						<p>{target}</p>
					</div>
				{/each}
			</div>
		</div>
	</CardContent>
</Card>
