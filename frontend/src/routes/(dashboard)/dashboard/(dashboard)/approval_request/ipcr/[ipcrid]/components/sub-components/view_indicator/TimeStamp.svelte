<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Calendar } from 'lucide-svelte';

	let {
		createdAt,
		updatedAt
	}: {
		createdAt: string;
		updatedAt: string;
	} = $props();

	// Format date to readable format
	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};
</script>

<Card>
	<CardContent class="pt-6">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="flex items-center gap-3">
				<Calendar class="text-muted-foreground h-5 w-5" />
				<div>
					<span class="block text-sm font-medium">Created At</span>
					<time class="text-muted-foreground text-sm">{formatDate(createdAt)}</time>
				</div>
			</div>
			<div class="flex items-center gap-3">
				<Calendar class="text-muted-foreground h-5 w-5" />
				<div>
					<span class="block text-sm font-medium">Updated At</span>
					<time class="text-muted-foreground text-sm">{formatDate(updatedAt)}</time>
				</div>
			</div>
		</div>
	</CardContent>
</Card>
