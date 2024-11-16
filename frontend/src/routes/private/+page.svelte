<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const user = data.user;
	const profile = data.profile;
</script>

<h1>Private page for user: {user?.email}</h1>
<h1>{profile.data?.first_name}</h1>
<h1>{profile.data?.last_name}</h1>
