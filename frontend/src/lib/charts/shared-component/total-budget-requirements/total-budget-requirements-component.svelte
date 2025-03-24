<script lang="ts">
	import { getSharedChartStore } from '../state';

	let { totalBudgetRequirementData } = getSharedChartStore();
	let displayBudget = $state('₱0.00'); // Default value for immediate display

	// Format function extracted for clarity
	const formatCurrency = (value: number) => {
		return Intl.NumberFormat('en-PH', {
			style: 'currency',
			currency: 'PHP'
		}).format(value);
	};

	// Reactive statement that updates displayBudget when store data changes
	$effect(() => {
		if ($totalBudgetRequirementData?.total_budget_requirements) {
			displayBudget = formatCurrency($totalBudgetRequirementData.total_budget_requirements);
		}
	});
</script>

<div>
	<h1 class="text-3xl">Total Budget <br /> Requirements:</h1>
	<br />
	<h1 class="text-3xl font-bold underline">{displayBudget}</h1>
</div>
