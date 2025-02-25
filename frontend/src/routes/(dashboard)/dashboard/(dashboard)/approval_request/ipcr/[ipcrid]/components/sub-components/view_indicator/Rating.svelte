<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Star, LineChart } from 'lucide-svelte';

	let {
		qualityRating,
		efficiencyRating,
		timelinessRating,
		averageRating,
		units
	}: {
		qualityRating: number;
		efficiencyRating: number;
		timelinessRating: number;
		averageRating: number;
		units: number;
	} = $props();

	// Scale description for ratings
	const ratingScale = '(1-5 Scale)';
</script>

<Card>
	<CardHeader>
		<CardTitle>Performance Ratings {ratingScale}</CardTitle>
	</CardHeader>
	<CardContent class="space-y-6">
		<div class="grid grid-cols-2 gap-6 md:grid-cols-4">
			<div class="space-y-2">
				<div class="flex items-center gap-2">
					<Star class="h-5 w-5 text-yellow-500" />
					<span class="text-sm font-medium">Quality</span>
				</div>
				<div>
					<p class="text-2xl font-semibold">{qualityRating.toFixed(2)}</p>
					<p class="text-muted-foreground text-xs">out of 5 points</p>
				</div>
			</div>
			<div class="space-y-2">
				<div class="flex items-center gap-2">
					<Star class="h-5 w-5 text-yellow-500" />
					<span class="text-sm font-medium">Efficiency</span>
				</div>
				<div>
					<p class="text-2xl font-semibold">{efficiencyRating.toFixed(2)}</p>
					<p class="text-muted-foreground text-xs">out of 5 points</p>
				</div>
			</div>
			<div class="space-y-2">
				<div class="flex items-center gap-2">
					<Star class="h-5 w-5 text-yellow-500" />
					<span class="text-sm font-medium">Timeliness</span>
				</div>
				<div>
					<p class="text-2xl font-semibold">{timelinessRating.toFixed(2)}</p>
					<p class="text-muted-foreground text-xs">out of 5 points</p>
				</div>
			</div>
			<div class="space-y-2">
				<div class="flex items-center gap-2">
					<Star class="text-primary h-5 w-5" />
					<span class="text-sm font-medium">Average</span>
				</div>
				<div>
					<p class="text-primary text-2xl font-semibold">{averageRating.toFixed(2)}</p>
					<p class="text-muted-foreground text-xs">out of 5 points</p>
				</div>
			</div>
		</div>

		<!-- Units Information -->
		<div class="border-t pt-4">
			<div class="flex items-center gap-2">
				<LineChart class="text-primary h-5 w-5" />
				<span class="text-sm font-medium">Units</span>
				<span class="text-muted-foreground text-sm">{units.toFixed(2)}</span>
			</div>
		</div>
	</CardContent>
</Card>
