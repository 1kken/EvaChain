<script lang="ts">
	import type { PageProps } from './$types';
	import SupervisorSection from './components/(dashboard)/supervisor-section.svelte';
	let props: PageProps = $props();
</script>

<div>
	<SupervisorSection populationPieChartProps={props.data.pieData!} />
</div>
