import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const IPCR_ACCOMPLISHMENT_STATE_KEY = Symbol('IPCR_ACCOMPLISHMENT_STATE_KEY');

type IpcrAccomplishmentState = {
	currentAccomplishments: Writable<Tables<'ipcr_indicator_accomplishment'>[]>;
	size: Writable<number>;
	addAccomplishment: (accomplishment: Tables<'ipcr_indicator_accomplishment'>) => void;
	updateAccomplishment: (
		id: string,
		updates: Partial<Tables<'ipcr_indicator_accomplishment'>>
	) => void;
	removeAccomplishment: (id: string) => void;
};

function createIpcrAccomplishmentStore(
	initialData?: Tables<'ipcr_indicator_accomplishment'>[]
): IpcrAccomplishmentState {
	const currentAccomplishments = writable<Tables<'ipcr_indicator_accomplishment'>[]>(
		initialData || []
	);
	const size = writable(initialData?.length || 0);

	currentAccomplishments.subscribe((accomplishments) => {
		size.set(accomplishments.length);
	});

	function addAccomplishment(accomplishment: Tables<'ipcr_indicator_accomplishment'>) {
		currentAccomplishments.update((accomplishments) => [...accomplishments, accomplishment]);
	}

	function updateAccomplishment(
		id: string,
		updates: Partial<Tables<'ipcr_indicator_accomplishment'>>
	) {
		currentAccomplishments.update((accomplishments) =>
			accomplishments.map((accomplishment) =>
				accomplishment.id === id ? { ...accomplishment, ...updates } : accomplishment
			)
		);
	}

	function removeAccomplishment(id: string) {
		currentAccomplishments.update((accomplishments) =>
			accomplishments.filter((accomplishment) => accomplishment.id !== id)
		);
	}

	return {
		currentAccomplishments,
		size,
		addAccomplishment,
		updateAccomplishment,
		removeAccomplishment
	};
}

export function getIpcrAccomplishmentStore(): IpcrAccomplishmentState {
	const store = getContext<IpcrAccomplishmentState>(IPCR_ACCOMPLISHMENT_STATE_KEY);
	if (!store) {
		throw new Error('IPCR Accomplishment store not found in context');
	}
	return store;
}

export function setIpcrAccomplishmentStore(
	initialData?: Tables<'ipcr_indicator_accomplishment'>[]
): IpcrAccomplishmentState {
	const store = createIpcrAccomplishmentStore(initialData);
	setContext(IPCR_ACCOMPLISHMENT_STATE_KEY, store);
	return store;
}

export type { IpcrAccomplishmentState };
