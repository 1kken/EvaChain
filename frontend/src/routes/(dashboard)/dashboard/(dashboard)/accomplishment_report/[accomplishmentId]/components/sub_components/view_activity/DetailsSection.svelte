<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	interface ItemDetail {
		accomplishmentRate: string | null;
		responsible_officer_unit: string | null;
		remarks: string | null;
	}

	let { itemDetail }: { itemDetail: ItemDetail } = $props();
</script>

<Card>
	<CardHeader>
		<CardTitle>Details</CardTitle>
	</CardHeader>
	<CardContent>
		<span class="text-sm font-medium">Accomplishment Rate</span>
		<p class="text-muted-foreground mt-1">{itemDetail.responsible_officer_unit}</p>
		<span class="text-sm font-medium">Responsible Officer/Unit</span>
		<p class="text-muted-foreground mt-1">{itemDetail.responsible_officer_unit}</p>
		<span class="text-sm font-medium">Remarks</span>
		<p class="text-muted-foreground mt-1">{itemDetail.remarks}</p>
	</CardContent>
</Card>
