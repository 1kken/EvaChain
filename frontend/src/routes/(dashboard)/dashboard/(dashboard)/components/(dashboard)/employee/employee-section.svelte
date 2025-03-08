<script lang="ts">
	import PopulationComponent from '$lib/charts/shared-component/population/population-component.svelte';
	import { getUserAuthStore } from '$lib/utils/rbac';
	import EmployeeAccomplishmentReport from './employee-accomplishment-report.svelte';
	import EmployeeBodyComponent from './employee-body-component.svelte';
	import FacultyComponent from './employee-header-component.svelte';

	const { hasRole } = getUserAuthStore();
	const shouldHideReport =
		hasRole('head_of_operating_unit') || hasRole('vice-president') || hasRole('president');
</script>

<div class="w-fit">
	<div class="flex flex-col items-center justify-center gap-2 sm:flex-row">
		<PopulationComponent />
		<FacultyComponent />
	</div>

	<div class="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row">
		<EmployeeBodyComponent />
	</div>

	{#if !shouldHideReport}
		<div class="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row">
			<EmployeeAccomplishmentReport />
		</div>
	{/if}
</div>
