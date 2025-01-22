<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Goal } from 'lucide-svelte';
	import { CalendarCheck } from 'lucide-svelte';
	import { FlagTriangleRight } from 'lucide-svelte';
	let {
		total,
		annualTarget,
		progress
	}: {
		total: string | null;
		annualTarget: string;
		progress: {
			q1: string | null;
			q2: string | null;
			q3: string | null;
			q4: string | null;
		};
	} = $props();
</script>

<Card>
	<CardContent class="space-y-3 md:grid md:grid-cols-2 md:space-y-0">
		<div class="space-x-1">
			<div class="flex space-x-1">
				<CalendarCheck color="#166535" />
				<Badge>Annual Target</Badge>
			</div>
			<div>
				{annualTarget}
			</div>
		</div>

		<div>
			<div class="flex space-x-1">
				<Goal color="#166535" />
				<Badge>Accomplishment Quarter</Badge>
			</div>
			<div class=" mt-2 flex items-center gap-4">
				{#each Object.entries(progress) as [quarter, target]}
					<div class="flex items-center gap-2">
						<span class="font-bold">
							{quarter.toUpperCase()}:
						</span>
						<p>{target}</p>
					</div>
				{/each}
			</div>
		</div>

		<div class="space-x-1">
			<div class="flex space-x-1">
				<FlagTriangleRight color="#166535" />
				<Badge>Total</Badge>
			</div>
			<div>
				{total}
			</div>
		</div>
	</CardContent>
</Card>
