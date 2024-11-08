<script lang="ts">
	let { data } = $props();
	let { countries, supabase, user } = $derived(data);
</script>

{#each countries as country (country.id)}
	<h1>{country.name}</h1>
{/each}

{#await data.supabase.auth.getUser()}
	<h1>Fetching!!</h1>
{:then id}
	<h1>{id.data.user?.email}</h1>
{/await}
