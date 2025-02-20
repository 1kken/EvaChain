<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Activity, Target } from 'lucide-svelte';

	let { indicator }: { indicator: string } = $props();
</script>

<div class="grid grid-cols-1">
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
