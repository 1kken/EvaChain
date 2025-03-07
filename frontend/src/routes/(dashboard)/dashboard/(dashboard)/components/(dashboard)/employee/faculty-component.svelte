<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import AcademicRank from '$lib/charts/shared-component/academic-rank/academic-rank-component.svelte';
	import EmployementStatusComponent from '$lib/charts/shared-component/employement-status/employement-status-component.svelte';
</script>

<!-- Single Card containing both Academic Rank and Employment Status -->
<Card.Root class="h-full border-none">
	<Card.Content class="border-none">
		<div class="flex flex-col gap-4 md:flex-row">
			<!-- Academic Rank -->
			<div class="h-48 w-full md:w-1/2">
				<h1 class="font-semibold">Academic Rank Overview</h1>
				<AcademicRank />
			</div>

			<!-- Employment Status -->
			<div class="h-48 w-full md:w-1/2">
				<h1 class="font-semibold">Employment Status Overview</h1>
				<EmployementStatusComponent />
			</div>
		</div>
	</Card.Content>
</Card.Root>
