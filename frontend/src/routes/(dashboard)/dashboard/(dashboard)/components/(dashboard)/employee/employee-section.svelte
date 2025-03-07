<script lang="ts">
	import PopulationComponent from '$lib/charts/shared-component/population/population-component.svelte';
	import FacultyComponent from './faculty-component.svelte';
</script>

<div class="flex gap-2">
	<!-- Population Component (not in a card) -->
	<div>
		<PopulationComponent />
	</div>
	<FacultyComponent />
</div>
