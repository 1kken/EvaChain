<script lang="ts">
	import CoreFunction from './(components)/(body)/(core_function)/CoreFunction.svelte';
	import OtherFunction from './(components)/(body)/(other_function)/OtherFunction.svelte';
	import SupportFunction from './(components)/(body)/(support_function)/SupportFunction.svelte';
	let { data } = $props();
</script>

<CoreFunction submitIPCRForm={data.ipcrForm.submitIPCRForm} />
<SupportFunction />
<OtherFunction />
