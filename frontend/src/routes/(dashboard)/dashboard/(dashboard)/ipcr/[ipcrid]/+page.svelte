<script lang="ts">
	import CoreFunction from './(components)/(body)/(core_function)/CoreFunction.svelte';
	let { data } = $props();
</script>

<CoreFunction currentIpcr={data.IPCR} submitIPCRForm={data.ipcrForm.submitIPCRForm} />
