<script lang="ts">
	import CoreFunction from './(components)/(body)/(core_function)/CoreFunction.svelte';
	let { data } = $props();
</script>

<CoreFunction currentIpcrId={data.ipcrId} />
