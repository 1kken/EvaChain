<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import type { Tables } from '$lib/types/database.types';
	import { Check, CircleX, Info, MailCheck, TriangleAlert } from 'lucide-svelte';

	let { notification }: { notification: Tables<'notifications'> } = $props();

	type NotificationType = 'success' | 'warning' | 'fail' | 'notification';
	const colorScheme: Record<NotificationType, string> = {
		success: 'bg-green-500',
		warning: 'bg-yellow-500',
		fail: 'bg-red-500',
		notification: 'bg-blue-500'
	};

	let isOpen = $state(false);
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger
		class={buttonVariants({ variant: 'ghost' }) + ' w-full outline-none focus-visible:outline-none'}
	>
		<div class="flex items-center">
			<div class="h-2 w-2 shrink-0">
				<!-- svelte-ignore element_invalid_self_closing_tag -->
				<div class={`h-full w-full rounded-full ${colorScheme[notification.type]}`} />
			</div>
			<span class="ml-2">{notification.title}</span>
		</div>
	</AlertDialog.Trigger>
	<AlertDialog.Content class="max-h-[85vh] overflow-y-auto sm:max-w-[700px]">
		<AlertDialog.Header>
			<AlertDialog.Title>
				<span class="flex items-center gap-2">
					{#if notification.type === 'success'}
						<Check color="#008236" />
					{/if}
					{#if notification.type === 'warning'}
						<TriangleAlert color="#fcc700" />
					{/if}
					{#if notification.type === 'fail'}
						<CircleX color="#e7000c" />
					{/if}
					{#if notification.type === 'notification'}
						<Info color="#006aa6" />
					{/if}

					{notification.title}
				</span>
			</AlertDialog.Title>
			<AlertDialog.Description>
				{notification.message}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Close</AlertDialog.Cancel>
			<AlertDialog.Action><MailCheck />Mark as Read</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
