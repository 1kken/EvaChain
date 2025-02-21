<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Bell } from 'lucide-svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { getNotificationStore } from '$lib/utils/notificationStore';
	import Notifications from './notifications.svelte';

	const { notifications, unreadCount } = getNotificationStore();
</script>

<Popover.Root>
	<Popover.Trigger class={buttonVariants({ variant: 'ghost' }) + ' relative'}>
		<Bell class="h-5 w-5" />
		{#if $unreadCount > 0}
			<span
				class="absolute -right-1 -top-1 block h-2.5 w-2.5 rounded-full bg-red-400 ring-2 ring-white"
			></span>
		{/if}
	</Popover.Trigger>
	<Popover.Content
		class="mr-4 w-80"
		side="bottom"
		align="center"
		onOpenAutoFocus={(e) => {
			e.preventDefault();
		}}
	>
		<div class="grid w-full gap-4">
			<div class="space-y-2">
				<h4 class="ml-4 font-medium leading-none">Notifications</h4>
				{#if $notifications.length > 0}
					{#each $notifications as notification}
						<Notifications {notification} />
					{/each}
				{:else}
					<p class="text-muted-foreground mr-4 text-sm">No new notifications</p>
				{/if}
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
