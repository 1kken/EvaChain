<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import type { Tables } from '$lib/types/database.types';
	import { getNotificationStore } from '$lib/utils/notificationStore';
	import { showErrorToast } from '$lib/utils/toast';
	import { Check, CircleX, Info, MailCheck, TriangleAlert } from 'lucide-svelte';

	let { notification }: { notification: Tables<'notifications'> } = $props();

	type NotificationType = 'success' | 'warning' | 'fail' | 'notification' | 'read';
	const colorScheme: Record<NotificationType, string> = {
		success: 'bg-green-500',
		warning: 'bg-yellow-500',
		fail: 'bg-red-500',
		notification: 'bg-blue-500',
		read: 'bg-gray-500'
	};

	const { markAsRead } = getNotificationStore();

	let isOpen = $state(false);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-GB', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	};

	function handleMarkAsRead() {
		markAsRead(notification.id)
			.then(() => {
				isOpen = false;
			})
			.catch((error) => {
				showErrorToast('Error marking notification as read');
			});
	}
</script>

<AlertDialog.Root bind:open={isOpen}>
	<AlertDialog.Trigger class="w-full rounded-md hover:bg-green-600 focus:outline-none">
		<div class="flex w-full items-start p-2">
			<div class="mt-1.5 h-2 w-2 flex-shrink-0">
				<!-- svelte-ignore element_invalid_self_closing_tag -->
				<div
					class={`h-full w-full rounded-full ${notification.is_read ? colorScheme['read'] : colorScheme[notification.type]}`}
				/>
			</div>
			<div class="ml-2 flex flex-grow flex-col items-start">
				<span class={`break-words text-left ${notification.is_read ? 'text-gray-500' : ''}`}>
					{notification.title}
				</span>
				<span class="text-xs text-gray-500">
					{formatDate(notification.created_at)}
				</span>
			</div>
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
			<AlertDialog.Description style="white-space: pre-line">
				{notification.message}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Close</AlertDialog.Cancel>
			{#if !notification.is_read}
				<AlertDialog.Action onclick={() => handleMarkAsRead()}
					><MailCheck />Mark as Read</AlertDialog.Action
				>
			{/if}
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
