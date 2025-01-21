import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const ACCOMPLISHMENT_ACTIVITY_STATE_KEY = Symbol('ACCOMPLISHMENT_ACTIVITY_STATE_KEY');

type AccomplishmentActivityState = {
	currentAccomplishmentActivities: Writable<Tables<'accomplishment_activity'>[]>;
	size: Writable<number>;
	addAccomplishmentActivity: (accomplishmentActivity: Tables<'accomplishment_activity'>) => void;
	updateAccomplishmentActivity: (
		id: string,
		updates: Partial<Tables<'accomplishment_activity'>>
	) => void;
	removeAccomplishmentActivity: (id: string) => void;
};

function createAccomplishmentActivityStore(
	initialData?: Tables<'accomplishment_activity'>[]
): AccomplishmentActivityState {
	const currentAccomplishmentActivities = writable<Tables<'accomplishment_activity'>[]>(
		initialData || []
	);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentAccomplishmentActivities changes
	currentAccomplishmentActivities.subscribe((activities) => {
		size.set(activities.length);
	});

	function addAccomplishmentActivity(accomplishmentActivity: Tables<'accomplishment_activity'>) {
		currentAccomplishmentActivities.update((activities) => [...activities, accomplishmentActivity]);
	}

	function updateAccomplishmentActivity(
		id: string,
		updates: Partial<Tables<'accomplishment_activity'>>
	) {
		currentAccomplishmentActivities.update((activities) =>
			activities.map((activity) => (activity.id === id ? { ...activity, ...updates } : activity))
		);
	}

	function removeAccomplishmentActivity(id: string) {
		currentAccomplishmentActivities.update((activities) =>
			activities.filter((activity) => activity.id !== id)
		);
	}

	return {
		currentAccomplishmentActivities,
		size,
		addAccomplishmentActivity,
		updateAccomplishmentActivity,
		removeAccomplishmentActivity
	};
}

export function getAccomplishmentActivityStore(): AccomplishmentActivityState {
	const store = getContext<AccomplishmentActivityState>(ACCOMPLISHMENT_ACTIVITY_STATE_KEY);
	if (!store) {
		throw new Error('Accomplishment Activity store not found in context');
	}
	return store;
}

export function setAccomplishmentActivityStore(
	initialData?: Tables<'accomplishment_activity'>[]
): AccomplishmentActivityState {
	const store = createAccomplishmentActivityStore(initialData);
	setContext(ACCOMPLISHMENT_ACTIVITY_STATE_KEY, store);
	return store;
}

export type { AccomplishmentActivityState };
