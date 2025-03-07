<script lang="ts">
	import PopulationComponent from '$lib/charts/shared-component/population/population-component.svelte';
	import FacultyComponent from './faculty-component.svelte';
</script>

<div class="flex flex-col items-center justify-center gap-2 sm:flex-row">
	<PopulationComponent />
	<FacultyComponent />
</div>
