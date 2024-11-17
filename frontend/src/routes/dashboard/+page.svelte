<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const user = data.user;
	const profile = data.profile;
</script>
