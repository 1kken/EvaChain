import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const OP_ACTIVITY_STATE_KEY = Symbol('OP_ACTIVITY_STATE_KEY');

type OpActivityState = {
	currentOpActivities: Writable<Tables<'op_activity'>[]>;
	size: Writable<number>;
	addOpActivity: (opActivity: Tables<'op_activity'>) => void;
	updateOpActivity: (id: string, updates: Partial<Tables<'op_activity'>>) => void;
	removeOpActivity: (id: string) => void;
};

function createOpActivityStore(initialData?: Tables<'op_activity'>[]): OpActivityState {
	const currentOpActivities = writable<Tables<'op_activity'>[]>(initialData || []);
	const size = writable(initialData?.length || 0);

	// Update size whenever currentOpActivities changes
	currentOpActivities.subscribe((activities) => {
		size.set(activities.length);
	});

	function addOpActivity(opActivity: Tables<'op_activity'>) {
		currentOpActivities.update((activities) => [...activities, opActivity]);
	}

	function updateOpActivity(id: string, updates: Partial<Tables<'op_activity'>>) {
		currentOpActivities.update((activities) =>
			activities.map((activity) => (activity.id === id ? { ...activity, ...updates } : activity))
		);
	}

	function removeOpActivity(id: string) {
		currentOpActivities.update((activities) => activities.filter((activity) => activity.id !== id));
	}

	return {
		currentOpActivities,
		size,
		addOpActivity,
		updateOpActivity,
		removeOpActivity
	};
}

export function getOpActivityStore(): OpActivityState {
	const store = getContext<OpActivityState>(OP_ACTIVITY_STATE_KEY);
	if (!store) {
		throw new Error('Op Activity store not found in context');
	}
	return store;
}

export function setOpActivityStore(initialData?: Tables<'op_activity'>[]): OpActivityState {
	const store = createOpActivityStore(initialData);
	setContext(OP_ACTIVITY_STATE_KEY, store);
	return store;
}

export type { OpActivityState };
