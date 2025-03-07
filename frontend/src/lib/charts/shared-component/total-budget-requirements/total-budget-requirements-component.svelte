<script lang="ts">
	import { getSharedChartStore } from '../state';

	let { totalBudgetRequirementData } = getSharedChartStore();
	let displayBudget = Intl.NumberFormat('en-PH', {
		style: 'currency',
		currency: 'PHP'
	}).format($totalBudgetRequirementData?.total_budget_requirements || 0);
</script>

<div>
	<h1 class="text-3xl">Total Budget <br /> Requirements:</h1>
	<br />
	<h1 class="text-3xl font-bold underline">{displayBudget}</h1>
</div>
