<script lang="ts">
	interface Props {
		id: string;
		name: string;
	}
	const prop: Props = $props();
</script>

<a href={`/dashboard/approval_request/ipcr/${prop.id}`} class="hover:underline">
	{prop.name}
</a>
