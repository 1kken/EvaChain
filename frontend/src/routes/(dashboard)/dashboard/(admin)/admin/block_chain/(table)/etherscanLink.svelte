<script lang="ts">
	interface Props {
		transactionHash: string;
	}
	const prop: Props = $props();
</script>

<a
	href="https://sepolia.etherscan.io/tx/{prop.transactionHash}"
	class="hover:underline"
	target="_blank"
	rel="noopener noreferrer">{prop.transactionHash}</a
>
