import type { Database, Tables } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const NOTIFICATION_STATE_KEY = Symbol('NOTIFICATION_STATE_KEY');
const MAX_NOTIFICATIONS = 10;

type Notification = Tables<'notifications'>;

interface NotificationState {
	notifications: Writable<Notification[]>;
	unreadCount: Writable<number>;
	markAsRead: (notificationId: string) => Promise<void>;
	initializeRealtimeSubscription: () => () => void;
	clearNotifications: () => void;
}

function createNotificationStore(
	supabase: SupabaseClient<Database>,
	userId: string
): NotificationState {
	const notifications = writable<Notification[]>([]);
	const unreadCount = writable<number>(0);

	// Subscribe to notifications changes to update unreadCount
	notifications.subscribe(($notifications) => {
		unreadCount.set($notifications.filter((n) => !n.is_read).length);
	});

	const updateNotifications = (newNotification: Notification) => {
		notifications.update((currentNotifications) => {
			if (currentNotifications.some((n) => n.id === newNotification.id)) {
				return currentNotifications;
			}
			return [newNotification, ...currentNotifications].slice(0, MAX_NOTIFICATIONS);
		});
	};

	const markAsRead = async (notificationId: string) => {
		try {
			const { data: notification } = await supabase
				.from('notifications')
				.select('is_global')
				.eq('id', notificationId)
				.single();

			if (notification?.is_global) {
				const localReadNotifications = JSON.parse(
					localStorage.getItem('readGlobalNotifications') || '{}'
				);
				localReadNotifications[notificationId] = true;
				localStorage.setItem('readGlobalNotifications', JSON.stringify(localReadNotifications));
			} else {
				await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
			}

			notifications.update((currentNotifications) =>
				currentNotifications.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
			);
		} catch (error) {
			console.error('Error marking notification as read:', error);
		}
	};

	const initializeRealtimeSubscription = () => {
		supabase
			.from('notifications')
			.select('*')
			.or(`receiver_id.eq.${userId},is_global.eq.true`)
			.order('created_at', { ascending: false })
			.limit(MAX_NOTIFICATIONS)
			.then(({ data }) => {
				if (data) {
					const localReadNotifications = JSON.parse(
						localStorage.getItem('readGlobalNotifications') || '{}'
					);

					const processedNotifications = data.map((notification) => ({
						...notification,
						is_read: notification.is_global
							? !!localReadNotifications[notification.id]
							: notification.is_read
					}));

					notifications.set(processedNotifications);
				}
			});

		const subscription = supabase
			.channel('notifications')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'notifications',
					filter: `receiver_id=eq.${userId}`
				},
				(payload) => {
					console.log('New notification:', payload.new);
					updateNotifications(payload.new as Notification);
				}
			)
			.subscribe();

		return () => subscription.unsubscribe();
	};

	const clearNotifications = () => {
		notifications.set([]);
	};

	return {
		notifications,
		unreadCount,
		markAsRead,
		initializeRealtimeSubscription,
		clearNotifications
	};
}

export function getNotificationStore(): NotificationState {
	const store = getContext<NotificationState>(NOTIFICATION_STATE_KEY);
	if (!store) throw new Error('Notification store not found in context');
	return store;
}

export function setNotificationStore(
	supabase: SupabaseClient<Database>,
	userId: string
): NotificationState {
	const store = createNotificationStore(supabase, userId);
	setContext(NOTIFICATION_STATE_KEY, store);
	return store;
}

export type { Notification, NotificationState };
