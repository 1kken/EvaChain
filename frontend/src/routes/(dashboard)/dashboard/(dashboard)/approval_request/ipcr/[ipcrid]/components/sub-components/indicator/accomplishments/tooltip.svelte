<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	interface Props {
		confidenceLevel: number | null;
	}

	let { confidenceLevel }: Props = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>{confidenceLevel}</Tooltip.Trigger>
		<Tooltip.Content
			>Confidence level represents how closely the provided document matches the Accomplishment,<br
			/>
			considering both content and overall structure. <br />
			A higher score (0-100) indicates greater similarity. Use this as a guide for verification</Tooltip.Content
		>
	</Tooltip.Root>
</Tooltip.Provider>
