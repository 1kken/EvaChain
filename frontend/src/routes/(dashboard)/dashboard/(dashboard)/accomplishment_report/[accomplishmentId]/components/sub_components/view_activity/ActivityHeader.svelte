<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Activity, Target } from 'lucide-svelte';

	let { activity, indicator }: { activity: string; indicator: string } = $props();
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
	<Card>
		<CardContent class="pt-6">
			<div class="space-y-2">
				<div class="flex space-x-1">
					<Activity color="#f59e0b" />
					<Badge variant={'secondary'} class="h-5 bg-amber-500 text-xs">Activity</Badge>
				</div>
				<h3 class="text-base tracking-tight">{activity}</h3>
			</div>
		</CardContent>
	</Card>

	<Card>
		<CardContent class="pt-6">
			<div>
				<div class="flex space-x-1">
					<Target color="#16a34a" />
					<Badge variant={'secondary'} class="h-5 bg-green-600 text-xs">Performance Indicator</Badge
					>
				</div>
				<h3 class="text-base tracking-tight">{indicator}</h3>
			</div>
		</CardContent>
	</Card>
</div>
