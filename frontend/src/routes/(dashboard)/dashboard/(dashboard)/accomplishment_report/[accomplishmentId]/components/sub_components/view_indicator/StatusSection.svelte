<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Goal, CalendarCheck, FlagTriangleRight, Percent } from 'lucide-svelte';

	let {
		total,
		annualTarget,
		accomplishmentRate,
		progress,
		inputType = 'text'
	}: {
		accomplishmentRate: string;
		total: string | null;
		annualTarget: string;
		inputType?: 'text' | 'number' | 'percentage' | 'ratio';
		progress: {
			q1: string | null;
			q2: string | null;
			q3: string | null;
			q4: string | null;
		};
	} = $props();

	// Check if any progress value is large text (more than 30 characters)
	const hasLargeText =
		Object.values(progress).some((value) => value && value.length > 30) ||
		(annualTarget && annualTarget.length > 30) ||
		(total && total.length > 30);
</script>

<Card class="w-full">
	<CardContent class="space-y-4 pt-4">
		<!-- Annual Target -->
		<div class="space-y-1">
			<div class="flex items-center space-x-1">
				<CalendarCheck class="h-4 w-4 text-emerald-700" />
				<Badge variant="outline" class="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
					>Annual Target</Badge
				>
			</div>
			<div class="break-words pl-5 text-sm">
				{annualTarget}
			</div>
		</div>

		<!-- If large text content, use a stacked layout -->
		{#if hasLargeText}
			<!-- Quarterly progress in stacked layout -->
			<div class="space-y-1">
				<div class="flex items-center space-x-1">
					<Goal class="h-4 w-4 text-emerald-700" />
					<Badge variant="outline" class="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
						>Quarterly Accomplishments</Badge
					>
				</div>
				<div class="grid gap-2 pl-5">
					{#each Object.entries(progress) as [quarter, value]}
						{#if value !== null && value !== ''}
							<div class="space-y-1">
								<span class="text-sm font-semibold">{quarter.toUpperCase()}:</span>
								<p class="break-words text-sm">{value}</p>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{:else}
			<!-- Quarterly progress in grid layout -->
			<div class="space-y-1">
				<div class="flex items-center space-x-1">
					<Goal class="h-4 w-4 text-emerald-700" />
					<Badge variant="outline" class="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
						>Quarterly Accomplishments</Badge
					>
				</div>
				<div class="grid grid-cols-2 gap-2 pl-5 sm:grid-cols-4">
					{#each Object.entries(progress) as [quarter, value]}
						<div class="flex items-center gap-1">
							<span class="text-sm font-semibold">{quarter.toUpperCase()}:</span>
							<span class="text-sm">{value || '-'}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Total and Accomplishment Rate -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<!-- Total -->
			<div class="space-y-1">
				<div class="flex items-center space-x-1">
					<FlagTriangleRight class="h-4 w-4 text-emerald-700" />
					<Badge variant="outline" class="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
						>Total</Badge
					>
				</div>
				<div class="break-words pl-5 text-sm">
					{total || '-'}
				</div>
			</div>

			<!-- Accomplishment Rate -->
			<div class="space-y-1">
				<div class="flex items-center space-x-1">
					<Percent class="h-4 w-4 text-emerald-700" />
					<Badge variant="outline" class="bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
						>Accomplishment Rate</Badge
					>
				</div>
				<div class="pl-5 text-sm">
					{accomplishmentRate || '-'}
				</div>
			</div>
		</div>
	</CardContent>
</Card>
