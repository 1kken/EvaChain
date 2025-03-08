<script lang="ts">
	import BarChartIregmHistory from '$lib/charts/shared-component/accomplishment-IREGM-history/bar-chart-IREGM-history.svelte';
	import BarchartAccomplishmentIregm from '$lib/charts/shared-component/accomplishment-IREGM/barchart-accomplishment-IREGM.svelte';
	import { getDashboardControlsStore } from '$lib/charts/shared-component/iregm_state';
	import { getSharedChartStore } from '$lib/charts/shared-component/state';
	import * as Card from '$lib/components/ui/card/index.js';
	const { officeName } = getSharedChartStore();
	const { IREGMYear } = getDashboardControlsStore();
</script>

<Card.Root class="h-full w-full border-none">
	<Card.Content class="border-none">
		<div class="flex flex-col gap-4 md:flex-row">
			<!-- IPCR Performance Analysis -->
			<div class={'h-48 w-fit md:w-1/2'}>
				<h1 class="font-semibold">
					{$officeName} Accomplishment Report Analysis
				</h1>
				<BarChartIregmHistory />
			</div>
			<div class={'h-48 w-fit md:w-1/2'}>
				<h1 class="font-semibold">
					{$officeName} Accomplishment Report Analysis Year {$IREGMYear}
				</h1>
				<BarchartAccomplishmentIregm />
			</div>
		</div>
	</Card.Content>
</Card.Root>
