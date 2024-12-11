<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';

	type BadgeVariant = 'default' | 'destructive' | 'outline' | 'secondary';

	interface Props {
		status: 'draft' | 'submitted' | 'reviewing' | 'approved' | 'revision';
	}

	let { status }: Props = $props();

	let config = $state<{ variant: BadgeVariant; text: string }>({
		variant: 'default',
		text: ''
	});

	// Update config when status changes
	$effect(() => {
		switch (status) {
			case 'draft':
				config = { variant: 'secondary', text: 'Draft' };
				break;
			case 'submitted':
				config = { variant: 'default', text: 'Submitted' };
				break;
			case 'reviewing':
				config = { variant: 'outline', text: 'Under Review' };
				break;
			case 'approved':
				config = { variant: 'default', text: 'Approved' };
				break;
			default:
				config = { variant: 'destructive', text: 'Unknown' };
		}
	});
</script>

<Badge variant={config.variant}>{config.text}</Badge>
