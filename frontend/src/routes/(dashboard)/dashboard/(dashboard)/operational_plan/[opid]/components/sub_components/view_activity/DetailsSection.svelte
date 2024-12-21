<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	interface ItemDetail {
		item: string | null;
		qty: string | number | null;
		unit: string | null;
		unit_cost: string | number | null;
		amount: string | number | null;
		fundSource: string | null;
	}

	let { itemDetail }: { itemDetail: ItemDetail } = $props();
</script>

<Card>
	<CardHeader>
		<CardTitle>Details</CardTitle>
	</CardHeader>
	<CardContent class="space-y-6">
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b">
						<th class="px-4 py-3 text-left">Item</th>
						<th class="px-4 py-3 text-right">Quantity</th>
						<th class="px-4 py-3 text-left">Unit</th>
						<th class="px-4 py-3 text-right">Unit Cost</th>
						<th class="px-4 py-3 text-right">Amount</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b">
						<td class="px-4 py-3">{itemDetail.item}</td>
						<td class="px-4 py-3 text-right">{itemDetail.qty}</td>
						<td class="px-4 py-3">{itemDetail.unit}</td>
						<td class="px-4 py-3 text-right"
							>{itemDetail.unit_cost ? `₱${itemDetail.unit_cost}` : ''}</td
						>
						<td class="px-4 py-3 text-right">{itemDetail.amount ? `₱${itemDetail.amount}` : ''}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div class="pt-4">
			<span class="text-sm font-medium">Fund Source</span>
			<p class="text-muted-foreground mt-1">{itemDetail.fundSource}</p>
		</div>
	</CardContent>
</Card>
