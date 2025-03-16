<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Info } from 'lucide-svelte';
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger><Info size="16" /></Tooltip.Trigger>
		<Tooltip.Content align="start">
			A confidence level of less than 50% would indicate that the uploaded evidence is fraudulent.
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
