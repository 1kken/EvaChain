<script lang="ts">
	import { Check, Square } from 'lucide-svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';

	let {
		formerState,
		progress
	}: {
		formerState: string;
		progress: { q1: string | null; q2: string | null; q3: string | null; q4: string | null };
	} = $props();
</script>

<Card>
	<CardHeader>
		<CardTitle>Status Overview</CardTitle>
	</CardHeader>
	<CardContent class="space-y-6">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="space-y-2">
				<span class="text-sm font-medium">Former State</span>
				<Badge variant="secondary">{formerState}</Badge>
			</div>
		</div>

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
