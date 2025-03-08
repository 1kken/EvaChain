<script lang="ts">
	import PopulationComponent from '$lib/charts/shared-component/population/population-component.svelte';
	import EmployeeBodyComponent from './employee-body-component.svelte';
	import FacultyComponent from './employee-header-component.svelte';
</script>

<div class="w-fit">
	<div class="flex flex-col items-center justify-center gap-2 sm:flex-row">
		<PopulationComponent />
		<FacultyComponent />
	</div>

	<div class="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row">
		<EmployeeBodyComponent />
	</div>
</div>
