<script lang="ts">
	interface Props {
		id: string;
		name: string;
	}
	const prop: Props = $props();
</script>

<a class="hover:underline" href={`/dashboard/dpcr/${prop.id}`}>{prop.name}</a>
