<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import logo from '$lib/assets/logo.svg';
</script>

<Sidebar.Header>
	<Sidebar.Menu>
		<Sidebar.MenuItem class=" flex  min-h-14 items-center">
			<Sidebar.MenuButton class="min-h-14 ">
				{#snippet child({ props })}
					<a href="/dashboard" {...props}>
						<img class=" max-h-11" src={logo} alt="standuplogo" />
						<span><h1 class="text-lg font-bold tracking-widest">EvaChain</h1></span>
					</a>
				{/snippet}
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
	</Sidebar.Menu>
</Sidebar.Header>
