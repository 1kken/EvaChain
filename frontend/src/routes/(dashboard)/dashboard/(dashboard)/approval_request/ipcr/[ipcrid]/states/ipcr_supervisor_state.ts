import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const SUPERVISOR_DETAIL_STATE_KEY = Symbol('SUPERVISOR_DETAIL_STATE_KEY');

type SupervisorDetailState = {
	currentSupervisorDetail: Writable<Tables<'ipcr_immediate_supervisor'> | null>;
	setDetail: (detail: Tables<'ipcr_immediate_supervisor'>) => void;
	clearDetail: () => void;
	updateDetail: (updates: Partial<Tables<'ipcr_immediate_supervisor'>>) => void;
};

function createSupervisorDetailStore(
	initialData?: Tables<'ipcr_immediate_supervisor'> | null
): SupervisorDetailState {
	const currentSupervisorDetail = writable<Tables<'ipcr_immediate_supervisor'> | null>(
		initialData || null
	);

	function setDetail(detail: Tables<'ipcr_immediate_supervisor'>) {
		currentSupervisorDetail.set(detail);
	}

	function clearDetail() {
		currentSupervisorDetail.set(null);
	}

	function updateDetail(updates: Partial<Tables<'ipcr_immediate_supervisor'>>) {
		currentSupervisorDetail.update((detail) => {
			if (!detail) return null;
			return { ...detail, ...updates };
		});
	}

	return {
		currentSupervisorDetail,
		setDetail,
		clearDetail,
		updateDetail
	};
}

export function getSupervisorDetailStore(): SupervisorDetailState {
	const store = getContext<SupervisorDetailState>(SUPERVISOR_DETAIL_STATE_KEY);
	if (!store) {
		throw new Error('Supervisor Detail store not found in context');
	}
	return store;
}

export function setSupervisorDetailStore(
	initialData?: Tables<'ipcr_immediate_supervisor'> | null
): SupervisorDetailState {
	const store = createSupervisorDetailStore(initialData);
	setContext(SUPERVISOR_DETAIL_STATE_KEY, store);
	return store;
}

export type { SupervisorDetailState };
