<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Calendar, MessageSquare } from 'lucide-svelte';

	let {
		remarks
	}: {
		remarks: string;
	} = $props();

	// Format date to readable format
	const formatDate = (date: string | null) => {
		if (date === null) return '';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};
</script>

<Card>
	<CardHeader>
		<CardTitle>Other Details</CardTitle>
	</CardHeader>
	<CardContent class="space-y-6">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="flex items-center gap-3">
				<MessageSquare class="text-primary h-5 w-5" />
				<div>
					<span class="block text-sm font-medium">Remarks</span>
					<p class="text-muted-foreground text-sm">{remarks}</p>
				</div>
			</div>
		</div>
	</CardContent>
</Card>
