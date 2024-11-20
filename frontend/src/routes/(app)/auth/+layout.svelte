<script lang="ts">
	let { children } = $props();
</script>

<div class="relative flex h-screen w-screen items-center justify-center">
	{@render children()}
</div>
