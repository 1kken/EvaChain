<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import DropDownWrapper from '$lib/custom_components/DropDownWrapper.svelte';
	import UniversalDeleteAction from '$lib/custom_components/UniversalDeleteAction.svelte';
	import type { Tables } from '$lib/types/database.types';
	import Update from './sub-components/indicator/update.svelte';
	import ViewIndicator from './view-indicator.svelte';

	interface Props {
		ipcrFunctionIndicator: Tables<'ipcr_indicator'>;
	}
	let { ipcrFunctionIndicator }: Props = $props();
	let isDrawerOpen = $state(false);
</script>

<div class="rounded-lg border">
	<div class="h-13 flex flex-col space-y-2 p-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-2">
				<Badge variant={'secondary'} class="h-5 bg-amber-500 text-xs">Indicator</Badge>
				<ViewIndicator currentIndicator={ipcrFunctionIndicator} />
			</div>
			<div>
				{#snippet updateDialog()}
					<Update {ipcrFunctionIndicator} bind:isDrawerOpen />
				{/snippet}

				<!-- This when the user can literally edit anything-->
				<DropDownWrapper childrens={[updateDialog]} bind:isDrawerOpen />
			</div>
		</div>
	</div>
</div>
