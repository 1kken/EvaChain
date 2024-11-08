<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	let state = $state(0);

	function increment() {
		state++;
	}
</script>

<Button onclick={increment}>Hello World! {state}</Button>
