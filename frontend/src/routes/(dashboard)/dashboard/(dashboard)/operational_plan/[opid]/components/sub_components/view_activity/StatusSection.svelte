<script lang="ts">
	import { Check, Square } from 'lucide-svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';

	let {
		formerState,
		desiredState,
		progress
	}: {
		formerState: string;
		desiredState: string;
		progress: { q1: boolean; q2: boolean; q3: boolean; q4: boolean };
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
			<div class="space-y-2">
				<span class="text-sm font-medium">Desired State</span>
				<Badge variant="default">{desiredState}</Badge>
			</div>
		</div>

		<div>
			<span class="text-sm font-medium">Implementation Quarters</span>
			<div class="mt-2 flex items-center gap-4">
				{#each Object.entries(progress) as [quarter, completed]}
					<div class="flex items-center gap-2">
						<span class="text-sm">{quarter.toUpperCase()}</span>
						{#if completed}
							<Check class="text-primary h-5 w-5" />
						{:else}
							<Square class="text-muted-foreground h-5 w-5" />
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</CardContent>
</Card>
