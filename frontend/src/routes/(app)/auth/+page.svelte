<script lang="ts">
	import type { PageServerData } from './$types';
	import AuthForm from './(components)/auth-form.svelte';
	let { data }: { data: PageServerData } = $props();
</script>

<div class="  mt-10 grid h-full w-96">
	<AuthForm form={data.form} />
</div>
