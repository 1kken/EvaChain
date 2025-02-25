<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	let {
		finalOutput,
		successIndicator
	}: {
		finalOutput: string;
		successIndicator: string;
	} = $props();

	// Get badge variant based on status
	const getBadgeVariant = (status: string): 'secondary' | 'default' | 'destructive' | 'outline' => {
		switch (status) {
			case 'draft':
				return 'secondary';
			case 'submitted':
				return 'secondary';
			case 'reviewing':
				return 'default';
			case 'revision':
				return 'destructive';
			case 'approved':
				return 'secondary';
			default:
				return 'default';
		}
	};
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold tracking-tight md:text-4xl">IPCR Indicator</h1>
	</div>
	<div class="space-y-2">
		<div>
			<span class="block text-sm font-medium">Final Output</span>
			<p class="text-muted-foreground text-lg">{finalOutput}</p>
		</div>
		<div>
			<span class="block text-sm font-medium">Success Indicator</span>
			<p class="text-muted-foreground text-lg">{successIndicator}</p>
		</div>
	</div>
</div>
