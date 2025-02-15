<script lang="ts">
	interface Props {
		cid: string;
		name: string;
	}
	const prop: Props = $props();
</script>

<form action="?/getfile" method="POST">
	<input type="hidden" name="file_cid" value={prop.cid} />
	<button type="submit" class="hover:underline">{prop.name}</button>
</form>
